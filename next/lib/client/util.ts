import { useEffect } from "react";
import { csrfHeaderName, csrfTokenVariableName, isSessionActiveCookieName } from "../../services/config/shared/config"

export function checkIsLoggedIn() {
    if (isServer()) return false;
    else return getCookie(isSessionActiveCookieName) === "true";
}

export function runOnClientRender(callback: () => {}) {
    useEffect(callback as any, []);
}

export function getCookie(name: string) {
    if (document.cookie.length > 0) {
        let startIndex = document.cookie.indexOf(name + "=");
        if (startIndex !== -1) {
            startIndex = startIndex + name.length + 1;
            let endIndex = document.cookie.indexOf(";", startIndex);
            if (endIndex == -1) {
                endIndex = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(startIndex, endIndex));
        }
    }
    return undefined;
}

function isServer() { return typeof window === "undefined" }

export async function csrfFetch(props: any, url: string, settings: any) {
    if (isServer()) return;
    const csrfToken = props[csrfTokenVariableName];
    settings.headers[csrfHeaderName] = csrfToken;
    return await fetch(url, settings);
}