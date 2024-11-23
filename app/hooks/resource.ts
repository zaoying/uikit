import { createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { Delete, Exchange, Get, JSONBody, PV, Post, Put, RESTful, Resource } from "../annotations/restful"
import { useIoC } from "./ioc"

/**
 * 资源提供者接口
 * @interface Provider
 * @template T 继承自 Resource 的资源类型
 * @description 用于创建资源实例的工厂函数接口
 * 
 * @example
 * // 定义一个用户资源提供者
 * const userProvider: Provider<UserResource> = (exchange) => new UserResource(exchange);
 * 
 * // 使用提供者创建资源实例
 * const userResource = userProvider(exchange);
 */
export interface Provider<T extends Resource> {
    (exchange: Exchange): T
}

/**
 * 拦截器接口
 * @interface Interceptor
 * @template T 拦截器处理的数据类型
 * @description 用于定义请求、响应或错误处理的拦截器函数
 * 
 * @property {string} [id] - 拦截器的唯一标识
 * @property {number} [order] - 拦截器的执行顺序
 * 
 * @example
 * // 定义一个请求拦截器
 * const requestInterceptor: Interceptor<RequestInit> = (config) => {
 *   config.headers = { ...config.headers, 'X-Token': 'xxx' };
 *   return config;
 * };
 */
export interface Interceptor<T> {
    (pre: T): T
    id?: string
    order?: number
}

/**
 * 拦截器管理器接口
 * @interface Interceptors
 * @description 用于管理请求、响应和错误处理的拦截器集合
 */
export interface Interceptors {
    /** 请求拦截器集合 */
    request: Map<string, Interceptor<RequestInit>>,
    /** 响应拦截器集合 */
    response: Map<string, Interceptor<Response>>,
    /** 错误处理拦截器集合 */
    errorHandler: Map<string, Interceptor<any>>,
    /**
     * 添加请求拦截器
     * @param {Interceptor<RequestInit>} interceptor - 请求拦截器函数
     * @param {number} [order] - 拦截器执行顺序
     * @returns {string} 返回拦截器的唯一标识
     */
    onRequest(interceptor: Interceptor<RequestInit>, order?: number): string,
    /**
     * 添加响应拦截器
     * @param {Interceptor<Response>} interceptor - 响应拦截器函数
     * @param {number} [order] - 拦截器执行顺序
     * @returns {string} 返回拦截器的唯一标识
     */
    onResponse(interceptor: Interceptor<Response>, order?: number): string,
    /**
     * 添加错误处理拦截器
     * @param {Interceptor<any>} interceptor - 错误处理拦截器函数
     * @param {number} [order] - 拦截器执行顺序
     * @returns {string} 返回拦截器的唯一标识
     */
    onError(interceptor: Interceptor<any>, order?: number): string
}

/**
 * 创建新的拦截器管理器实例
 * @function NewInterceptors
 * @returns {Interceptors} 返回一个新的拦截器管理器实例，包含请求、响应和错误处理的拦截器集合
 * @description 用于创建一个新的拦截器管理器，提供请求前、响应后和错误处理的拦截能力
 * 
 * @example
 * // 创建拦截器实例
 * const interceptors = NewInterceptors();
 * 
 * // 添加请求拦截器
 * interceptors.onRequest((request) => {
 *   request.headers = {
 *     ...request.headers,
 *     'Content-Type': 'application/json'
 *   };
 *   return request;
 * });
 * 
 * // 添加响应拦截器
 * interceptors.onResponse((response) => {
 *   if (!response.ok) {
 *     throw new Error('请求失败');
 *   }
 *   return response;
 * });
 * 
 * // 添加错误处理拦截器
 * interceptors.onError((error) => {
 *   console.error('请求错误:', error);
 *   throw error;
 * });
 */
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

/**
 * 拦截器上下文
 * @constant InterceptorContext
 * @description 创建一个 React Context 用于在组件树中共享拦截器实例。
 * 默认值是通过 NewInterceptors() 创建的新拦截器实例。
 * 
 * @example
 * // 在组件中使用拦截器上下文
 * function MyComponent() {
 *   const interceptors = useContext(InterceptorContext);
 *   // 使用拦截器...
 * }
 */
export const InterceptorContext = createContext(NewInterceptors())

/**
 * 获取拦截器上下文的 Hook
 * @function useInterceptor
 * @returns {Interceptors} 返回当前上下文中的拦截器实例
 * @description 一个自定义 Hook，用于在函数组件中获取拦截器上下文
 * 
 * @example
 * function MyComponent() {
 *   const interceptors = useInterceptor();
 *   
 *   useEffect(() => {
 *     // 添加请求拦截器
 *     interceptors.onRequest({
 *       id: 'my-interceptor',
 *       intercept: (init) => {
 *         // 处理请求...
 *         return init;
 *       }
 *     });
 *   }, []);
 *   
 *   return <div>组件内容</div>;
 * }
 */
export function useInterceptor() {
    return useContext(InterceptorContext)
}

/**
 * 分页数据接口
 * @interface Page<T>
 * @template T - 分页数据项的类型
 * @description 用于封装分页查询的结果，包含总数和当前页数据
 * 
 * @example
 * interface UserPage extends Page<User> {}
 * 
 * // 使用示例
 * const userPage: Page<User> = {
 *   total: 100,
 *   data: [user1, user2, ...]
 * };
 */
export interface Page<T> {
    /** 数据总条数 */
    total: number
    /** 当前页的数据列表 */
    data: T[]
}

/**
 * 通用的增删改查(CRUD)资源基类
 * @class CURD<T>
 * @implements {Resource}
 * @template T - 资源类型泛型参数
 * @description 提供标准的 RESTful API 操作，包括列表查询、创建、读取、更新和删除功能
 * 
 * @example
 * class UserResource extends CURD<User> {
 *   // 可以添加额外的特定方法
 *   async searchByName(name: string): Promise<User[]> {
 *     // 实现搜索逻辑
 *   }
 * }
 * 
 * @remarks
 * - list(): 获取分页列表
 * - create(): 创建新资源
 * - get(): 获取单个资源
 * - update(): 更新资源
 * - delete(): 删除资源
 */
@RESTful("example.com", "resource")
export class CURD<T> implements Resource {
    exchange: Exchange
    constructor(exchange: Exchange) {
        this.exchange = exchange
    }

    /**
     * 获取资源的分页列表
     * @template T 资源类型
     * @param {number} [page=1] - 当前页码，默认为1
     * @param {number} [pageSize=10] - 每页显示的数量，默认为10
     * @returns {Promise<Page<T>>} 返回包含分页数据的Promise对象
     * 
     * @example
     * // 获取第一页，每页10条数据
     * const page = await resource.list();
     * 
     * // 获取第2页，每页20条数据
     * const page = await resource.list(2, 20);
     */
    @Get("?page={page}&pageSize={pageSize}")
    async list(@PV("page") page?: number, @PV("pageSize") pageSize?: number): Promise<Page<T>> {
        return (await this.exchange(page ?? 1, pageSize ?? 10)).json()
    }

    /**
     * 创建新的资源
     * @template T 资源类型
     * @param {T} t - 要创建的资源对象
     * @returns {Promise<Response>} 返回创建结果的Response对象
     * 
     * @example
     * const newUser = { name: '张三', age: 25 };
     * const response = await resource.create(newUser);
     */
    @Post("")
    async create(@JSONBody() t: T): Promise<Response> {
        return this.exchange(t)
    }

    /**
     * 获取指定ID的资源
     * @template T 资源类型
     * @param {string} id - 资源ID
     * @returns {Promise<T>} 返回资源对象的Promise
     * 
     * @example
     * const user = await resource.get('123');
     * console.log(user);
     */
    @Get("{id}")
    async get(@PV("id") id: string): Promise<T> {
        return (await this.exchange(id)).json()
    }

    /**
     * 更新指定ID的资源
     * @template T 资源类型
     * @param {string} id - 要更新的资源ID
     * @param {T} t - 更新的资源对象
     * @returns {Promise<Response>} 返回更新结果的Response对象
     * 
     * @example
     * const updatedUser = { name: '李四', age: 30 };
     * const response = await resource.update('123', updatedUser);
     */
    @Put("{id}")
    async update(@PV("id") id: string, @JSONBody() t: T): Promise<Response> {
        return this.exchange(id, t)
    }

    /**
     * 删除指定ID的资源
     * @template T 资源类型
     * @param {string} id - 要删除的资源ID
     * @returns {Promise<Response>} 返回删除结果的Response对象
     * 
     * @example
     * const response = await resource.delete('123');
     */
    @Delete("{id}")
    async delete(@PV("id") id: string): Promise<Response> {
        return this.exchange(id)
    }
}

/**
 * 资源钩子函数
 * @function useResource
 * @template T 继承自 Resource 的资源类型
 * @param {Provider<T>} provider - 资源提供者函数，用于创建资源实例
 * @returns {T} 返回一个配置好的资源实例
 * @description 用于在 React 组件中创建和配置资源实例的钩子函数
 * 
 * @example
 * // 在组件中使用资源钩子
 * function UserList() {
 *   const userResource = useResource(UserResourceProvider);
 *   
 *   useEffect(() => {
 *     // 使用资源实例获取用户列表
 *     userResource.list().then(users => {
 *       // 处理用户列表
 *     });
 *   }, []);
 *   
 *   return <div>用户列表</div>;
 * }
 * 
 * @remarks
 * - 自动注入依赖的 Exchange 实例
 * - 配置拦截器
 * - 处理资源实例的方法代理
 */
export function useResource<T extends Resource>(provider: (exchange: Exchange) => T): T {
    const context = useIoC()
    const exchange = context.inject(DefaultExchange)
    const sub = context.inject(provider)
    const resource = sub(exchange)
    const interceptors = useInterceptor()
    invoke(resource, resource, interceptors)
    return resource
}

/**
 * 默认的 Exchange 实现
 * @function DefaultExchange
 * @returns {Promise<Response>} 返回一个默认的空 Response 实例
 * @description 用于在资源实例创建时提供一个默认的 Exchange 实现
 * 
 * @example
 * const resource = useResource(UserResourceProvider);
 */
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