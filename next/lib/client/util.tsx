import { capitalize } from "@material-ui/core";
import { Flattened, FlattenedValue } from "combined-validator";
import { ChangeEvent } from "react";
import { useEffect } from "react";
import { csrfHeaderName, isSessionActiveCookieName } from "../../config/shared/config"

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

export async function csrfFetch(csrfToken: string, url: string, settings: any) {
    if (isServer()) return;
    settings.headers[csrfHeaderName] = csrfToken;
    return await fetch(url, settings);
}

export function undoCamelCase(s: string) {
    return s.replace(/([A-Z])/g, ' $1').toLowerCase();
}

export function genInputElement(name: string, flattenedValue: FlattenedValue, formStates: any, formStateSetters: any, validationCallback?: (k: string, v: any) => void) {
    const inputType = flattenedValue.type;
    if (typeof inputType !== "string") return <p>To be implemented</p>

    function setValue(v: any) {
        if (validationCallback !== undefined) validationCallback(name, v);
        formStateSetters[name]?.(v)
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

export type ValidateClientResult = [string[], {
    [key: string]: any
}]

export function extractAndValidateFormData(formStates: any, fieldStructure: Flattened, additionalValidate?: { [key: string]: (v: any) => boolean }): ValidateClientResult {
    const errors: string[] = [];
    const cleanedData = Object.fromEntries(Object.entries(formStates).filter(([k, v]) => v !== "")) // exclude optional stuff

    // convert all dates to iso
    Object.entries(fieldStructure).filter(([k, v]) => v.type === "date").forEach(([k, v]) => cleanedData[k] = new Date(cleanedData[k] as string).toISOString())
    // convert all number strings to numbers
    Object.entries(fieldStructure).filter(([k, v]) => v.type === "number").forEach(([k, v]) => cleanedData[k] = new Number(cleanedData[k] as string))

    Object.entries(fieldStructure).forEach(([k, v]) => {

        // additional stuff
        if (additionalValidate?.[k] !== undefined && !additionalValidate[k](v)) errors.push(`Please enter a valid value for ${k}`)

        // enums
        if (v.enum !== undefined && !v.enum.includes(cleanedData[k])) errors.push(`Please select a valid value for ${k}`)
    })

    // custom ones

    return [errors, cleanedData];
}