import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createRef, FormEvent, RefObject, useState } from "react";
import { csrfFetch, extractAndValidateFormData, undoCamelCase, genInputElement } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

import { organisations as organisationsFieldSpec } from "../config/shared/publicFieldConstants"
import { flatten, Flattened } from "combined-validator";
import { capitalize } from "@material-ui/core";
import { useEffect } from "react";

import isEmail from 'validator/lib/isEmail'


export default function OrganisationSignup({ csrfToken, signupFields }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const formStates: any = {}
    const formStateSetters: any = {}

    const [formErrors, setFormErrors] = useState([] as string[]);

    const formRef: RefObject<HTMLFormElement> = createRef();

    Object.entries(signupFields).forEach(([k, v]) => {
        const [state, stateSetter] = useState("")
        formStates[k] = state
        formStateSetters[k] = stateSetter
    })

    const [perElementErrors, setPerElementErrors] = useState({} as {
        [key: string]: string
    })

    function connectValidator(callback: (v: any) => boolean) {
        return (k: string, v: any) => {
            const hasPassed = callback(v);

            if (!hasPassed) {
                perElementErrors[k] = `Please enter a valid value for ${k}`
            } else {
                delete perElementErrors[k]
            }

            setPerElementErrors(perElementErrors);

            return hasPassed
        }
    }

    const validationCallbacks: { [k: string]: (k: string, v: any) => boolean } = {
        email: connectValidator(isEmail)
    }

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

            if (res.status !== 200) return setFormErrors([await res.text()]);

            setShowEmailUnavailableWarning(await res.json() !== true); // fail-safe - if something goes wrong, it shows the warning
        })()
    }, [formStates.email])

    async function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        formRef.current?.checkValidity();

        const [errors, cleanedData] = extractAndValidateFormData(formStates, signupFields, {
            // email: isEmail // technically not needed because of the html5 verification going on
        });

        if (showEmailUnavailableWarning) errors.push("This email is already used");

        if (errors.length !== 0) return setFormErrors(errors)
        setFormErrors([]); // delete them again

        const res = await csrfFetch(csrfToken, "/api/signupOrg", {
            method: "POST",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(cleanedData)
        });
        if (res?.status !== 200) return setFormErrors([await res?.text() ?? "Something went wrong"]);

        const resText = await res?.text();
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
                                    {e}
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
                        {genInputElement(k, v, formStates, formStateSetters, validationCallbacks[k])}
                        {
                            k === "email" && showEmailUnavailableWarning ?
                                <span>This email isn't available</span>
                                : perElementErrors[k] === undefined ? null :
                                    <span>{perElementErrors[k]}</span>
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
