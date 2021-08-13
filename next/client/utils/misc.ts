import { Dispatch, SetStateAction } from "react";

export function undoCamelCase(s: string) {
    let out =  s.replace(/([A-Z])/g, ' $1'); // add a space before all the capital letters
    out = out.replace(/([0-9]+)/g, ' $1'); // add a space before digits
    out = out.toLowerCase();
    return out;
}

async function createErrorMessage(res: Response) { // it is a separate function to account for a possible improvement
    return `${res.status >= 500 ? "Server" : "Client"} error: ${await res.text()}`
}

export async function updateOverallErrorsForRequests(res: Response, thisId: string, overallErrors: {
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
    return true
}
