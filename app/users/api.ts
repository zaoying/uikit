import { Exchange } from "~/annotations/restful"
import { CURD } from "~/hooks/resource"

/**
 * 用户信息接口
 * @interface User
 */
export interface User {
    /** 用户唯一标识 */
    id: string
    /** 用户名 */
    username: string
    /** 性别 */
    gender: "male" | "female"
    /** 出生日期 */
    birthDate: Date
    /** 用户类别 */
    category: "admin" | "ordinary",
    /** 用户描述（可选） */
    description?: string
}

/**
 * 用户资源管理类
 * @class UserResource
 * @extends {CURD<User>}
 * @description 提供用户相关的增删改查(CRUD)操作
 * @example
 * const userResource = new UserResource(exchange);
 * // 获取用户列表
 * const users = await userResource.list();
 * // 创建新用户
 * const newUser = await userResource.create({ username: "张三", ... });
 */
export class UserResource extends CURD<User> {
}

/**
 * 创建用户资源管理实例的工厂函数
 * @param {Exchange} exchange - 用于处理 HTTP 请求的交换器实例
 * @returns {UserResource} 返回一个新的用户资源管理实例
 * @example
 * const exchange = new Exchange();
 * const userResource = UserResourceProvider(exchange);
 * await userResource.list(); // 获取用户列表
 */
export function UserResourceProvider(exchange: Exchange): UserResource {
    return new UserResource(exchange)
}