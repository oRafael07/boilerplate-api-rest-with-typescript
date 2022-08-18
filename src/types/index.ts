
export interface IRequestRegister {
    name: string
    username: string
    email: string
    password: string
}

export interface IRequestLogin{
    email: string,
    password: string
}

export interface IRequestRefreshToken{
    refresh_token: string
}