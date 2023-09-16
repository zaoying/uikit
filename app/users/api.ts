import { Exchange, RESTful } from "~/annotations/restful"
import { CURD } from "~/hooks/resource"


export interface User {
    id: string
    username: string
    gender: "male" | "female"
    birthDate: Date
    category: "admin" | "ordinary",
    description?: string
}

@RESTful("localhost", "users")
export class UserResource extends CURD<User> {
}

export function UserResourceProvider(exchange: Exchange): UserResource {
    return new UserResource(exchange)
}