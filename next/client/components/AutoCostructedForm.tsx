import { capitalize } from "@material-ui/core";
import { Flattened } from "combined-validator";
import { useEffect } from "react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { createRef, RefObject, useState } from "react";
import { FC } from "react";
import { extractAndValidateFormData, genInputElement } from "../utils/formUtils";
import { undoCamelCase } from "../utils/misc";

type PerElementValidatorCallback = (v: any) => boolean | Promise<boolean>;
export type PerElementValidatorCallbacks = { [k: string]: PerElementValidatorCallback | PerElementValidatorCallback[] };

const AutoConstructedForm: FC<{
    fields: Flattened,
    perElementValidationCallbacks: PerElementValidatorCallbacks,
    presentableNames?: {[key: string]: string}, 
    onSubmit: (evt: FormEvent<HTMLFormElement>, data: {
        [key: string]: any
    }) => Promise<void>,
    overallErrors: {
        [key: string]: string
    },
    setOverallErrors: Dispatch<SetStateAction<{
        [key: string]: string;
    }>>
}> = ({ fields, perElementValidationCallbacks, onSubmit: onSubmitCalback, overallErrors, setOverallErrors, presentableNames }) => {
    const formStates: any = {}
    const formStateSetters: any = {}

    const formRef: RefObject<HTMLFormElement> = createRef();


    // add states
    Object.entries(fields).forEach(([k, v]) => {
        const [state, stateSetter] = useState("")
        formStates[k] = state
        formStateSetters[k] = stateSetter
    })
    const [perElementErrors, setPerElementErrors] = useState({} as {
        [key: string]: string
    })

    // delete the error messages on field change
    useEffect(() => {
        setOverallErrors({})
        Object.keys(overallErrors).forEach((k) => delete overallErrors[k]) // so that when setting values based off that, they are consistant, we need to loop over and not to assign to an empty object so that it is recognised by reference

    }, Object.values(formStates))

    function connectPerElementValidator(callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[]) {
        if (callbacks === undefined) return undefined;

        if (!Array.isArray(callbacks)) callbacks = [callbacks]

        return async (k: string, v: any) => {
            let hasPassed = true;
            let message = `Please enter a valid value for ${k}`;

            try {
                // check that all promises are fulfilled

                // the parallel way
                // const promisesToCheck = (callbacks as PerElementValidatorCallback[]).map(async (cb) => await cb(v));
                // const results = await Promise.all(promisesToCheck);
                // hasPassed = results.every(v => v);

                // the serial way
                for (let cb of (callbacks as PerElementValidatorCallback[])) {
                    const result = await cb(v)
                    if (!result) { hasPassed = false; break; }
                }

            } catch (e) {
                hasPassed = false;
                message = e.message
            }

            // so that when react compares the previous and the current value, it does not find them to be the same
            const copy: any = Object.assign({}, perElementErrors)

            if (!hasPassed) {
                copy[k] = message
            } else {
                delete copy[k]
            }

            setPerElementErrors(copy); // actually make react do its thing

            return hasPassed
        }
    }

    function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        if (!formRef.current?.checkValidity()) return;

        //  do not submit if there is an error
        // TODO: highlight those errors 
        if (Object.keys(perElementErrors).length !== 0) return;
        if (Object.keys(overallErrors).length !== 0) return;
        // actual request

        const [errors, cleanedData] = extractAndValidateFormData(formStates, fields);
        if (Object.keys(errors).length !== 0) return setOverallErrors(errors)

        onSubmitCalback(evt, cleanedData);
    }


    return <>
        {
            Object.keys(overallErrors).length === 0 ? null :
                <>
                    <h1>Something went wrong:</h1>
                    < h2 >
                        {
                            Object.values(overallErrors).map((e, index) => {
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
                Object.entries(fields).map(([k, v], index) => {
                    const getName = (n: string) => presentableNames?.[n] ?? capitalize(undoCamelCase(n)); 

                    return <p key={index}>
                        <label htmlFor={k}>{getName(k)} {v.required ? "(required)" : null}</label>
                        {genInputElement(k, v, formStates, formStateSetters, connectPerElementValidator(perElementValidationCallbacks[k]))}
                        {
                            perElementErrors[k] === undefined ? null :
                                <span>{perElementErrors[k]}</span>
                        }
                    </p>
                })
            }
            <button className="submit" type="submit">Wow, i sure do trust this website!</button>
        </form>
    </>
}

export default AutoConstructedForm