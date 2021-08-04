import { capitalize } from "@material-ui/core";
import { Flattened, FlattenedValue } from "combined-validator";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { csrfHeaderName, currentPageHeaderName, isOrgCookieName, isSessionActiveCookieName } from "../../config/shared/config"

function isLoggedIn() {
    if (isServer()) return false;
    else {
        const isLoggedIn = getCookie(isSessionActiveCookieName) === "true";

        const bc = new BroadcastChannel("loginEvents");
        bc.postMessage(isLoggedIn);
        return isLoggedIn;
    }
}

export type ViewerType = "loggedOut" | "user" | "org" | "server"
export function activateViewProtection(allow: ViewerType[]) {
    const router = useRouter();

    const currentViewType = useViewerType();
    console.log(currentViewType)
    if (!allow.includes(currentViewType)) {
        router.push("/notAllowed")
        return false;
    }

    return true;
}

export function useViewerType(): ViewerType {
    if (isServer()) return "server";
    const isLoggedIn = useIsLoggedIn()
    if (!isLoggedIn) return "loggedOut";
    return isOrg() ? "org" : "user"
}

function isOrg() {
    if (isServer()) return false;
    else return getCookie(isOrgCookieName) === "true";
}

export function useIsAfterRehydration() {
    const [isFirstRender, setIsFirstRender] = useState(false);
    useEffect(() => setIsFirstRender(true), [])
    return isFirstRender;
}

export function useIsLoggedIn() {
    if (isServer()) return false;
    const [isLoggedInState, setIsLoggedInState] = useState(false); // start off false (default on the server) and then change if needed
    useEffect(() => setIsLoggedInState(isLoggedIn()), []); // change after rehydration

    const bc = new BroadcastChannel("loginEvents");
    bc.onmessage = function (evt) {
        setIsLoggedInState(evt.data);
    }

    return isLoggedInState
}

export function updateLoginState() {
    const bc = new BroadcastChannel("loginEvents");
    bc.postMessage(isLoggedIn());
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

export async function csrfFetch(csrfToken: string, url: string, settings: any) {
    settings.headers[csrfHeaderName] = csrfToken;
    settings.headers[currentPageHeaderName] = window.location.pathname;
    return await fetch(url, settings);
}

export function undoCamelCase(s: string) {
    return s.replace(/([A-Z])/g, ' $1').toLowerCase();
}

export function genInputElement(name: string, flattenedValue: FlattenedValue, formStates: any, formStateSetters: any, validationCallback?: (k: string, v: any) => Promise<boolean>) {
    const inputType = flattenedValue.type;
    if (typeof inputType !== "string") return <p>To be implemented</p>

    function setValue(v: any) {
        formStateSetters[name]?.(v) // do it straight away for responsiveness
        if (validationCallback !== undefined) { validationCallback(name, v); }
    }

    if (flattenedValue.enum !== undefined)
        return <select className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} >
            {
                formStates[name] ? null : <option value="notSelected">Select:</option> // only show this if nothing else is selected
            }
            {Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) =>
                <option key={k} value={v}>
                    {capitalize(undoCamelCase(v))}
                </option>
            )}
        </select>

    const newProps: any = {}

    switch (inputType) {
        case "string":
            newProps.type = ["email", "password"].includes(name) ? name : "text"
            newProps.maxLength = flattenedValue?.maxLength;
            break;

        case "number":
            newProps.type = "text"
            newProps.pattern = "\\d*"
            newProps.title = "Please enter a number"
            newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value.replace(/[^\d]/g, "")) // remove non-digits
            break;

        case "date":
            newProps.type = "date"
            break;

        case "boolean":
            newProps.placeholder = "WORK IN PROGRESS";
            newProps.type = "text"
        default:
            break;
    }

    return <input className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} {...newProps} />;
}

export type ValidateClientResult = [{
    [key: string]: string
}, {
    [key: string]: any
}]

export function extractAndValidateFormData(formStates: any, fieldStructure: Flattened): ValidateClientResult {
    const errors: {
        [key: string]: string
    } = {};
    const cleanedData = Object.fromEntries(Object.entries(formStates).filter(([k, v]) => v !== "")) // exclude optional stuff

    const currentStructure = Object.fromEntries(Object.entries(fieldStructure).filter(([k, v]) => v.required || cleanedData[k] !== undefined)) // remove things that are not present and are not required

    // convert all dates to iso
    Object.entries(currentStructure).filter(([k, v]) => v.type === "date").forEach(([k, v]) => cleanedData[k] = new Date(cleanedData[k] as string).toISOString())
    // convert all number strings to numbers
    Object.entries(currentStructure).filter(([k, v]) => v.type === "number").forEach(([k, v]) => cleanedData[k] = parseInt(cleanedData[k] as string))

    Object.entries(currentStructure).forEach(([k, v]) => {
        // enums
        if (v.enum !== undefined && !v.enum.includes(cleanedData[k])) errors[`enum_${k}`] = `Please select a valid value for ${k}`
    })

    // custom ones

    return [errors, cleanedData];
}

export async function createErrorMessage(res: Response) {
    return `${res.status >= 500 ? "Server" : "Client"} error: ${await res.text()}`
}

export async function updateOverallErrors(res: Response, thisId: string, overallErrors: {
    [key: string]: string;
},
    setOverallErrors: Dispatch<SetStateAction<{
        [key: string]: string;
    }>>) {
    const overallErrorsCopy = Object.assign({}, overallErrors); // so that when react compares the previous and the current value, it does not find them to be the same
    if (res.status >= 400) {
        overallErrorsCopy[thisId] = await createErrorMessage(res);
        setOverallErrors(overallErrorsCopy);
        return false
    }

    delete overallErrorsCopy[thisId];
    setOverallErrors(overallErrorsCopy);
    return true
}