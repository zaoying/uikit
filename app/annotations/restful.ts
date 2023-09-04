
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTION"

export interface Exchange {
    (...args: any[]): Promise<Response>
}

export interface Operation {
    method?: Method
    path?: string
    headers?: Record<string, string>
    pathVariables: {name: string, order: number}[]
    requestBody?: {order: number, encode: (body: any) => BodyInit}
}

export interface Operations {
    [key: string]: Operation
}

export interface Resource {
    exchange: Exchange
    endpoint?: string
    resourceName?: string
    headers?: Record<string, string>
    operations?: Operations
}

export const RESTfulHeader: Record<string, string> = {
    "Content-Type": "application/json"
}

export function RESTful(endpoint: string, resource?: string, headers?: Record<string, string>) {
    return function<T extends { new (...args: any[]): Resource}>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(...args)
                this.endpoint = endpoint
                this.resourceName = resource
                this.headers = headers ? {...headers, ...RESTfulHeader} : {...RESTfulHeader}
            }
        }
    }
}

export function RequestMapping(method: Method, path: string, headers?: Record<string, string>) {
    return function(target: Resource, methodName: string, descriptor: PropertyDescriptor) {
        if (!target.operations) {
            target.operations = {}
        }
        const op = target.operations[methodName] ?? {pathVariables: []}
        op.method = method
        op.path = path
        op.headers = headers
        target.operations[methodName] = op
    }
}

export function Get(path: string, headers?: Record<string, string>) {
    return RequestMapping("GET", path, headers)
}

export function Post(path: string, headers?: Record<string, string>) {
    return RequestMapping("POST", path, headers)
}

export function Put(path: string, headers?: Record<string, string>) {
    return RequestMapping("PUT", path, headers)
}

export function Patch(path: string, headers?: Record<string, string>) {
    return RequestMapping("PATCH", path, headers)
}

export function Delete(path: string, headers?: Record<string, string>) {
    return RequestMapping("DELETE", path, headers)
}

export function Option(path: string, headers?: Record<string, string>) {
    return RequestMapping("OPTION", path, headers)
}

export function PathVariable(name: string) {
    return function(target: Resource, propertyKey: string | symbol, parameterIndex: number) {
        if (!target.operations) {
            target.operations = {}
        }
        const methodName = String(propertyKey)
        const op = target.operations[methodName] ?? {pathVariables: []}
        const pv = {name: name, order: parameterIndex}
        op.pathVariables.push(pv)
        target.operations[methodName] = op
    }
}

export const PV = PathVariable

export interface Encoder<T> {
    (src: T): BodyInit
}

export function RequestBody<T>(encoder: Encoder<T>) {
    return function(target: Resource, propertyKey: string | symbol, parameterIndex: number) {
        if (!target.operations) {
            target.operations = {}
        }
        const methodName = String(propertyKey)
        const op = target.operations[methodName] ?? {pathVariables: []}
        op.requestBody = {order: parameterIndex, encode: encoder}
        target.operations[methodName] = op
    }
}

export function JSONBody() {
    return RequestBody<Object>(JSON.stringify)
}

export function PlainBody() {
    return RequestBody<Object>(String)
}

export function FileBody() {
    return RequestBody<Blob>((src) => src)
}