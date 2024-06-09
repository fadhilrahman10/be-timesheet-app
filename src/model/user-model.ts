import {User} from "@prisma/client";

export type UserResponse = {
    username: string;
    name: string;
    rate: number;
    token?: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    name?: string;
    password?: string;
    rate?: number;
}

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
    rate: number;
}

export function toUserResponse(user: User): UserResponse {
    return {
        username: user.username,
        name: user.name,
        rate: user.rate,
    }
}