import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createRef, FormEvent, RefObject, useState } from "react";
import { csrfFetch, extractAndValidateFormData, undoCamelCase, genInputElement } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

import { organisations as organisationsFieldSpec } from "../config/shared/publicFieldConstants"
import { flatten, Flattened } from "combined-validator";
import { capitalize } from "@material-ui/core";
import { useEffect } from "react";


export default function OrganisationSignup({ csrfToken, signupFields }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const formStates: any = {}
    const formStateSetters: any = {}

    const [formErrors, setFormErrors] = useState([] as Error[]);

    const formRef: RefObject<HTMLFormElement> = createRef();

    Object.entries(signupFields).forEach(([k, v]) => {
        const [state, stateSetter] = useState("")
        formStates[k] = state
        formStateSetters[k] = stateSetter
    })

    const [showEmailUnavailableWarning, setShowEmailUnavailableWarning] = useState(false);
    useEffect(() => {
        console.log("update");
        (async () => {
            const res = await fetch("/api/isEmailFree?" +
                new URLSearchParams({ email: formStates.email }), {
                method: "GET",
                credentials: "same-origin", // only send cookies for same-origin requests
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json",
                },
            })
            setShowEmailUnavailableWarning(await res.json() !== true); // fail-safe - if something goes wrong, it shows the warning
        })()
    }, [formStates.email])

    async function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        formRef.current?.checkValidity();

        const [errors, cleanedData] = extractAndValidateFormData(formStates, signupFields);

        if (showEmailUnavailableWarning) errors.push(new Error("This email is already used"));

        if (errors.length !== 0) return setFormErrors(errors)
        setFormErrors([]); // delete them again

        const response = await csrfFetch(csrfToken, "/api/signupOrg", {
            method: "POST",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(cleanedData)
        });
        const resText = await response?.text();
        console.log(cleanedData, resText)
    }

    return <div>
        <p>Hello and welcome to my secure website</p>

        {
            formErrors.length === 0 ? null :
                <>
                    <h1>Something went wrong:</h1>
                    < h2 >
                        {
                            formErrors.map((e, index) => {
                                return <p key={index}>
                                    {e.message}
                                </p>
                            })
                        }
                    </h2>
                </>

        }

        <form onSubmit={onSubmit} ref={formRef}>
            {
                Object.entries(signupFields).map(([k, v], index) => {
                    return <p key={index}>
                        <label htmlFor={k}>{capitalize(undoCamelCase(k))} {v.required ? "(required)" : null}</label>
                        {genInputElement(k, v, formStates, formStateSetters)}
                        {
                            k === "email" && showEmailUnavailableWarning ?
                                <span>This email isn't available</span>
                                : null
                        }
                    </p>
                })
            }
            <button className="submit" type="submit">Wow, i sure do trust this website!</button>
        </form>
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
