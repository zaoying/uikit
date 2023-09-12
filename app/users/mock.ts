import { Exchange, RESTful } from "~/annotations/restful"
import { useMock } from "~/hooks/mock"
import { User, UserResource, UserResourceProvider } from "./api"

export function useMockForDev() {
    useMock(UserResourceProvider, (exchange: Exchange) => {
        const users: User[] = [
            { id: "0", username: "张三", birthDate: new Date(1973, 5), gender: "male", category: "admin" },
            { id: "1", username: "李四", birthDate: new Date(1985, 7), gender: "male", category: "ordinary" },
            { id: "2", username: "王五", birthDate: new Date(1992, 9), gender: "male", category: "ordinary" }
        ]
        @RESTful("http://mock-server:8080/backend", "users")
        class UserResourceForMock extends UserResource {
            async list(page: number, pageSize: number): Promise<User[]> {
                return Promise.resolve(users)
            }
            async create(user: User): Promise<Response> {
                users.push(user)
                return Promise.resolve(new Response("{}"))
            }
            async get(id: string): Promise<User> {
                const user = users.filter(u => u.id == id)
                return user.length ? Promise.resolve(user[0]) : Promise.reject("not found")
            }
            async update(id: string, user: User): Promise<Response> {
                const matched = users.findIndex(u => u.id == id)
                if (matched >= 0) {
                    users.splice(matched, 1, user)
                    return Promise.resolve(new Response("{}"))
                }
                return Promise.reject("not found")
            }
            async delete(id: string): Promise<Response> {
                const matched = users.findIndex(u => u.id == id)
                if (matched >= 0) {
                    users.splice(matched, 1)
                    return Promise.resolve(new Response("{}"))
                }
                return Promise.reject("not found")
            }
        }
        return new UserResourceForMock(exchange)
    })
}