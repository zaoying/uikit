import { Exchange, RESTful } from "../annotations/restful"
import { CURD } from "../hooks/resource"


export interface User {
    username: string
    password: string
    role: string[]
}

@RESTful("localhost", "users")
export class UserResource extends CURD<User> {
}

export function UserResourceProvider(exchange: Exchange): UserResource {
    return new UserResource(exchange)
}