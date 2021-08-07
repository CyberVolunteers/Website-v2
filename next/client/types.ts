export type ViewerType = "loggedOut" | "user" | "org" | "server" | "hydrating"

export type ValidateClientResult = [{
    [key: string]: string
}, {
    [key: string]: any
}]

export type AutoConstructedFormData = {
    // we don't want to check the types here
    // eslint-disable-next-line
    [key: string]: any;
};

declare global {
    interface Window {
        wasHeadIncluded?: boolean
    }
}