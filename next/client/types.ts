export type ViewerType = "loggedOut" | "user" | "org" | "server" | "hydrating"

export type ValidateClientResult = [{
    [key: string]: string
}, {
    [key: string]: any
}]