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