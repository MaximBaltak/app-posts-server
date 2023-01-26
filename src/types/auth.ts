import {UserEntity} from "../../database/entities/User.entity";

export interface RequestAuth {
    login: string,
    password: string
}
export interface PayloadToken{
    id: number,
    login: string
}
export interface UserAuth {
    user: UserEntity,
    token: string
}
