import { capitalize } from "@material-ui/core";
import { Flattened, FlattenedValue } from "combined-validator";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ValidateClientResult } from "../types";
import { undoCamelCase, updateOverallErrorsForRequests } from "./misc";

export function genInputElement(name: string, flattenedValue: FlattenedValue, formStates: any, formStateSetters: any, validationCallback?: (k: string, v: any) => Promise<boolean>) {
    const inputType = flattenedValue.type;
    if (typeof inputType !== "string") return <span>To be implemented</span>

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

// validation
export function createIsEmailIsAvailableValidator(overallErrors: {
    [key: string]: string;
},
    setOverallErrors: Dispatch<SetStateAction<{
        [key: string]: string;
    }>>) {
    return async function (email: string) {
        const res = await fetch(`/api/isEmailFree?${new URLSearchParams({ email })}`, {
            method: "GET",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
        })

        if (!await updateOverallErrorsForRequests(res, "isUserEmailAvailable", overallErrors, setOverallErrors)) return false;

        if (await res.json() !== true) throw new Error("This email is not available") // fail-safe - if something goes wrong, it shows the warning
        return true
    }
}