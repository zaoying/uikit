import { createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { Delete, Exchange, Get, JSONBody, PV, Post, Put, RESTful, Resource } from "../annotations/restful"
import { useIoC } from "./ioc"

export interface Provider<T extends Resource> {
    (exchange: Exchange): T
}

export interface Interceptor<T> {
    (pre: T): T
    id?: string
    order?: number
}

export interface Interceptors {
    request: Map<string, Interceptor<RequestInit>>,
    response: Map<string, Interceptor<Response>>,
    errorHandler: Map<string, Interceptor<any>>,
    onRequest(interceptor: Interceptor<RequestInit>, order?: number): string,
    onResponse(interceptor: Interceptor<Response>, order?: number): string,
    onError(interceptor: Interceptor<any>, order?: number): string
}

export function NewInterceptors(): Interceptors {
    const request = new Map<string, Interceptor<RequestInit>>()
    const response = new Map<string, Interceptor<Response>>()
    const errorHandler = new Map<string, Interceptor<any>>()
    return {
        request,
        response,
        errorHandler,
        onRequest(interceptor: Interceptor<RequestInit>, order?: number) {
            let id = interceptor.id
            if (!id) {
                id = uuidv4()
                interceptor.id = id
            }
            request.set(id, interceptor)
            return id
        },
        onResponse(interceptor: Interceptor<Response>, order?: number) {
            let id = interceptor.id
            if (!id) {
                id = uuidv4()
                interceptor.id = id
            }
            response.set(id, interceptor)
            return id
        },
        onError(interceptor: Interceptor<any>, order?: number) {
            let id = interceptor.id
            if (!id) {
                id = uuidv4()
                interceptor.id = id
            }
            errorHandler.set(id, interceptor)
            return id
        }
    }
}

export const InterceptorContext = createContext(NewInterceptors())

export function useInterceptor() {
    return useContext(InterceptorContext)
}

export interface Page<T> {
    total: number
    data: T[]
}

@RESTful("example.com", "resource")
export class CURD<T> implements Resource {
    exchange: Exchange
    constructor(exchange: Exchange) {
        this.exchange = exchange
    }

    @Get("?page={page}&pageSize={pageSize}")
    async list(@PV("page") page?: number, @PV("pageSize") pageSize?: number): Promise<Page<T>> {
        return (await this.exchange(page ?? 1, pageSize ?? 10)).json()
    }

    @Post("")
    async create(@JSONBody() t: T): Promise<Response> {
        return this.exchange(t)
    }

    @Get("{id}")
    async get(@PV("id") id: string): Promise<T> {
        return (await this.exchange(id)).json()
    }

    @Put("{id}")
    async update(@PV("id") id: string, @JSONBody() t: T): Promise<Response> {
        return this.exchange(id, t)
    }

    @Delete("{id}")
    async delete(@PV("id") id: string): Promise<Response> {
        return this.exchange(id)
    }
}

export function useResource<T extends Resource>(provider: (exchange: Exchange) => T): T {
    const context = useIoC()
    const exchange = context.inject(DefaultExchange)
    const sub = context.inject(provider)
    const resource = sub(exchange)
    const interceptors = useInterceptor()
    invoke(resource, resource, interceptors)
    return resource
}

function DefaultExchange(...args: any[]) {
    return Promise.resolve(new Response("{}"))
}

function invoke<T extends Resource>(resource: T, top: T, interceptors: Interceptors) {
    const proto = Object.getPrototypeOf(resource)
    if (!proto) {
        return
    }
    invoke(proto, top, interceptors)
    const props = Object.getOwnPropertyDescriptors(resource)
    for (const key in props) {
        const prop = props[key].value
        if (typeof prop == "function") {
            const exchange = sendRequest(key, resource, top, interceptors)
            if (exchange) {
                const replace = prop.bind({...resource, exchange: exchange})
                const map = new Map([[key, replace]])
                Object.assign(resource, Object.fromEntries(map.entries()))
            }
        }
    }
}

function sendRequest(methodName: string, res: Resource, top: Resource, interceptors: Interceptors): Exchange | undefined {
    if (!res.operations) {
        return 
    }
    const op = res.operations[methodName]
    if (!op) {
        return
    }
    const headers = top.headers ?? {}
    const opHeaders = op.headers ?? {}
    return async (...args: any[]) => {
        let path = op.path
        if (path && op.pathVariables) {
            for (const pv of op.pathVariables) {
                path = path.replace("{" + pv.name + "}", String(args[pv.order]))
            }
        }
        const url = `${top.endpoint}/${top.resourceName}/${path}`
        let request: RequestInit = {
            method: op.method,
            headers: {...headers, ...opHeaders}
        }
        if (op.requestBody) {
            const order = op.requestBody.order
            request.body = op.requestBody.encode(args[order])
        }
        try {
            interceptors.request.forEach((interceptor) => {
                request = interceptor(request)
            })
            let response = await fetch(url, request)
            interceptors.response.forEach((interceptor) => {
                response = interceptor(response)
            })
            return Promise.resolve(response)
        } catch (e) {
            let err = e
            interceptors.errorHandler.forEach((handler) => {
                err = handler(err)
            })
            return Promise.reject(err)
        }
    }
}