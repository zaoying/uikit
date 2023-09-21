import { Delete, Exchange, Get, JSONBody, PV, Post, Put, RESTful, Resource } from "../annotations/restful"
import { useIoC } from "./ioc"

export interface Provider<T extends Resource> {
    (exchange: Exchange): T
}

export interface RequestInterceptor {
    (req: RequestInit): RequestInit
}

export interface ResponseInterceptor {
    (res: Response): Response
}

const globalRequestInterceptor: RequestInterceptor[] = []
const globalResponseInterceptor: ResponseInterceptor[] = []

export function addRequestInterceptor(interceptor: RequestInterceptor) {
    globalRequestInterceptor.push(interceptor)
}

export function addResponseInterceptor(interceptor: ResponseInterceptor) {
    globalResponseInterceptor.push(interceptor)
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
    invoke(resource, resource)
    return resource
}

function DefaultExchange(...args: any[]) {
    return Promise.resolve(new Response("{}"))
}

function invoke<T extends Resource>(resource: T, top: T) {
    const proto = Object.getPrototypeOf(resource)
    if (!proto) {
        return
    }
    invoke(proto, top)
    const props = Object.getOwnPropertyDescriptors(resource)
    for (const key in props) {
        const prop = props[key].value
        if (typeof prop == "function") {
            const exchange = sendRequest(key, resource, top)
            if (exchange) {
                const replace = prop.bind({...resource, exchange: exchange})
                const map = new Map([[key, replace]])
                Object.assign(resource, Object.fromEntries(map.entries()))
            }
        }
    }
}

function sendRequest<T>(methodName: string, res: Resource, top: Resource): Exchange | undefined {
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
            for (const interceptor of globalRequestInterceptor) {
                request = interceptor(request)
            }
            let response = await fetch(url, request)
            for (const interceptor of globalResponseInterceptor) {
                response = interceptor(response)
            }
            return Promise.resolve(response)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}