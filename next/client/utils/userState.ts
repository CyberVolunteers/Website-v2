import { useEffect, useState } from "react";
import { accountInfoCookieName } from "../../serverAndClient/cookiesConfig";
import { ViewerType } from "../types";

function getCookie(name: string) {
    if (document.cookie.length > 0) {
        let startIndex = document.cookie.indexOf(name + "=");
        if (startIndex !== -1) {
            startIndex = startIndex + name.length + 1;
            let endIndex = document.cookie.indexOf(";", startIndex);
            if (endIndex == -1) {
                endIndex = document.cookie.length;
            }
            const out = decodeURIComponent(document.cookie.substring(startIndex, endIndex));
            // try decode
            try{
                return JSON.parse(out);
            }catch{
                return out;
            }
        }
    }
    return undefined;
}

function isServer() { return typeof window === "undefined" }

function isOrg() {
    if (isServer()) return false;
    else return getAccountInfo()?.isOrg === true;
}

function isLoggedIn() {
    if (isServer()) return false;
    else {
        return getAccountInfo()?.isSessionActive === true;
    }
}

function getPureViewerType(): ViewerType { // "pure" means that it can't be hydrating
    if (isServer()) return "server";
    if (!isLoggedIn()) return "loggedOut";
    const accountInfo = getAccountInfo();
    if(isOrg()){
        // is it verified?
        return accountInfo?.isEmailVerified === true && accountInfo?.isOrganisationVerified === true ? "org" : "unverified_org";
    }else{
        return accountInfo?.isEmailVerified === true ? "user" : "unverified_user";
    }
}

export function getAccountInfo(){
    return getCookie(accountInfoCookieName)
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

        const bc = new BroadcastChannel("loginEvents"); //TODO: a channel specifically for verifying
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