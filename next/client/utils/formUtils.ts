import { Flattened } from "combined-validator";
import { Dispatch, SetStateAction } from "react";
import { updateOverallErrorsForRequests } from "./misc";

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

export function addError(overallErrors: {
    [key: string]: string;
},
    setOverallErrors: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>,
    name: string, e: string) {
    const overallErrorsCopy = Object.assign({}, overallErrors);
    overallErrorsCopy[name] = e;
    setOverallErrors(overallErrorsCopy);
}

export function setFieldsOrder(fields: Flattened, order: string[], isAtTheEnd: boolean = false){
    const copy = Object.assign({}, fields);
    const collected = {} as {
        [key: string]: any
    };

    order.forEach(k => {
        if(copy[k] === undefined) return;
        collected[k] = copy[k];
        delete copy[k];
    })

    if(isAtTheEnd) return {...copy, ...collected};
    else return {...collected, ...copy};
}
