import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { FormEvent, useState } from "react";
import { csrfFetch, updateOverallErrors } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

import { organisations as organisationsFieldSpec } from "../config/shared/publicFieldConstants"
import { flatten, Flattened } from "combined-validator";

import isEmail from 'validator/lib/isEmail'
import AutoConstructedForm, { PerElementValidatorCallbacks } from "../components/AutoCostructedForm";

export default function OrganisationSignup({ csrfToken, signupFields }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [overallErrors, setOverallErrors] = useState({} as {
        [key: string]: string
    });

    const perElementValidationCallbacks: PerElementValidatorCallbacks = {
        email: [isEmail, checkIfEmailIsAvailable],
    }

    async function checkIfEmailIsAvailable(email: string) {
        const res = await fetch("/api/isEmailFree?" +
            new URLSearchParams({ email }), {
            method: "GET",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
        })

        if (!await updateOverallErrors(res, "isOrgEmailAvailable", overallErrors, setOverallErrors)) return false;

        if (await res.json() !== true) throw new Error("This email is not available") // fail-safe - if something goes wrong, it shows the warning
        return true
    }

    async function onSubmit(evt: FormEvent<HTMLFormElement>, data: {
        [key: string]: any
    }) {
        const res = await csrfFetch(csrfToken, "/api/signupOrg", {
            method: "POST",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!await updateOverallErrors(res, "orgSignupPost", overallErrors, setOverallErrors)) return;
    }

    return <div>
        <p>Hello and welcome to my secure website</p>

        <AutoConstructedForm fields={signupFields} onSubmit={onSubmit} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
    </div>
}

export const getServerSideProps: GetServerSideProps<{
    csrfToken: string,
    signupFields: Flattened
}> = async (context) => {
    return {
        props: {
            csrfToken: await updateCsrf(context),
            signupFields: flatten(organisationsFieldSpec),
        }, // will be passed to the page component as props
    }
}
