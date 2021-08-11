import { capitalize } from "@material-ui/core";
import { Flattened, FlattenedValue } from "combined-validator";
import { ChangeEvent, useEffect } from "react";
import { ReactElement } from "react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { createRef, RefObject, useState } from "react";
import { FC } from "react";
import { ValidateClientResult } from "../types";
import { undoCamelCase } from "../utils/misc";
import FormComponent, { PerElementValidatorCallbacks, PerElementValidatorCallback } from "./FormComponen";

const AutoConstructedForm: FC<{
    fields: Flattened,
    perElementValidationCallbacks: PerElementValidatorCallbacks,
    presentableNames?: { [key: string]: string },
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
    function createState(f: Flattened) {
        Object.entries(f).forEach(([k, v]) => {
            if (typeof v.type !== "string") return createState(v.type); // nested
            const [state, stateSetter] = useState(
                v.array === true ? [] :
                    v.type === "boolean" ? false : ""
            )
            formStates[k] = state
            formStateSetters[k] = stateSetter
        })
    }

    createState(fields)

    const [perElementErrors, setPerElementErrors] = useState({} as {
        [key: string]: string
    })

    // delete the error messages on field change
    useEffect(() => {
        setOverallErrors({})
        setPerElementErrors({})

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
                // it calls everything - we don't want that many calls to the endpoint
                // TODO: maybe detect sync vs async?
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

        const [errors, newPerElementErrors, cleanedData] = extractAndValidateFormData(formStates, fields);
        if (Object.keys(errors).length !== 0) return setOverallErrors(errors)
        if (Object.keys(newPerElementErrors).length !== 0) return setPerElementErrors(newPerElementErrors)

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

                    return <p key={index}>
                        <FormComponent name={k} flattenedValue={v} formStates={formStates} formStateSetters={formStateSetters} connectPerElementValidator={connectPerElementValidator} perElementValidationCallbacks={perElementValidationCallbacks} perElementErrors={perElementErrors} presentableNames={presentableNames}/>
                    </p>
                })
            }
            <button className="submit" type="submit">Wow, i sure do trust this website!</button>
        </form>
    </>
}

export default AutoConstructedForm





function extractAndValidateFormData(formStates: any, fieldStructure: Flattened): ValidateClientResult {
    const errors: {
        [key: string]: string
    } = {};
    const perElementErrors: {
        [key: string]: string
    } = {};

    const cleanedinputData = Object.fromEntries(Object.entries(formStates).filter(([k, v]) => v !== "")) // exclude optional stuff, but leave booleans

    const cleanedOutputData = {} as {
        [key: string]: any
    }

    function applySpecialConsiderations(structure: Flattened, out: {
        [key: string]: any
    }) {
        Object.entries(structure).forEach(([k, v]) => {
            if (cleanedinputData[k] === undefined && !v.required) return; // remove things that are not present and not required

            const type = v.type;
            if (typeof type !== "string") {
                out[k] = {}
                return applySpecialConsiderations(type, out[k]);
            }

            switch (type) {
                case "date":
                    // convert all dates to iso
                    cleanedinputData[k] = new Date(cleanedinputData[k] as string).toISOString()
                    break;
                case "number":
                    // convert all number strings to numbers
                    cleanedinputData[k] = parseInt(cleanedinputData[k] as string)
                    break;
            }

            // enums
            if (v.enum !== undefined && v.array !== true && !v.enum.includes(cleanedinputData[k])) return perElementErrors[k] = `Please select a valid value`

            // finally, if nothing took care of it, show this generic error
            if (cleanedinputData[k] === undefined) return errors.valuesAreRequired = "Please make sure you have specified all the required values";

            out[k] = cleanedinputData[k]
        })
    }

    applySpecialConsiderations(fieldStructure, cleanedOutputData);

    return [errors, perElementErrors, cleanedOutputData];
}
