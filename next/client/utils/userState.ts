import { useEffect, useState } from "react";
import { isOrgCookieName, isSessionActiveCookieName } from "../../serverAndClient/cookiesConfig";
import { ViewerType } from "../types";

declare global {
    interface Window { loginEventsBroadcastChannel: BroadcastChannel; }
}

function getCookie(name: string) {
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

function isOrg() {
    if (isServer()) return false;
    else return getCookie(isOrgCookieName) === "true";
}

function isLoggedIn() {
    if (isServer()) return false;
    else {
        return getCookie(isSessionActiveCookieName) === "true";
    }
}

function getPureViewerType(): ViewerType { // "pure" means that it can't be hydrating
    if (isServer()) return "server";
    if (!isLoggedIn()) return "loggedOut";
    return isOrg() ? "org" : "user"
}


export function updateLoginState() {
    const bc = new BroadcastChannel("loginEvents");
    const out = isLoggedIn()
    bc.postMessage(out);
    return out;
}

// hooks
export function useViewerType(): ViewerType {
    const [viewerType, setViewerType] = useState((isServer() ? "server" : "hydrating") as ViewerType);

    useEffect(() => {
        setViewerType(getPureViewerType())

        const bc = new BroadcastChannel("loginEvents");
        bc.onmessage = function () {
            setViewerType(getPureViewerType());
        }

        // cleanup
        return function () {
            bc.close()
        }
    }, [])

    if (viewerType === "server" || viewerType === "hydrating") return viewerType // do not set up broadcast channels


    return viewerType
}