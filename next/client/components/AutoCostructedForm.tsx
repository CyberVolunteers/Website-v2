import { capitalize } from "@material-ui/core";
import { Flattened, FlattenedValue } from "combined-validator";
import { ChangeEvent, useEffect } from "react";
import { ReactElement } from "react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { createRef, RefObject, useState } from "react";
import { FC } from "react";
import { ValidateClientResult } from "../types";
import { undoCamelCase, updateOverallErrorsForRequests } from "../utils/misc";

type PerElementValidatorCallback = (v: any) => boolean | Promise<boolean>;
export type PerElementValidatorCallbacks = { [k: string]: PerElementValidatorCallback | PerElementValidatorCallback[] };

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
            const [state, stateSetter] = useState(v.type === "boolean" ? false : "")
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
                        {genInputElement(k, v, formStates, formStateSetters, connectPerElementValidator, perElementValidationCallbacks, presentableNames)}
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





export function genInputElement(
    name: string,
    flattenedValue: FlattenedValue,
    formStates: any,
    formStateSetters: any,
    connectPerElementValidator: (callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[] | undefined) => ((k: string, v: any) => Promise<boolean>) | undefined,
    perElementValidationCallbacks: PerElementValidatorCallbacks,
    presentableNames?: { [key: string]: string }
): ReactElement {
    const validationCallback = connectPerElementValidator(perElementValidationCallbacks[name]);
    const outLabel = <label htmlFor={name}>{presentableNames?.[name] ?? capitalize(undoCamelCase(name))} {flattenedValue.required ? "(required)" : null}</label>

    const inputType = flattenedValue.type;

    if (typeof inputType !== "string") return <>
        {outLabel}
        {/* recurse */}
        {Object.entries(inputType).map(([newName, newVal]) => <span key={newName}>
            {genInputElement(newName, newVal, formStates, formStateSetters, connectPerElementValidator, perElementValidationCallbacks, presentableNames)}
        </span>
        )}
    </>

    function setValue(v: any) {
        formStateSetters[name]?.(v) // do it straight away for responsiveness
        if (validationCallback !== undefined) { validationCallback(name, v); }
    }

    if (flattenedValue.enum !== undefined)
        return <>
            {outLabel}
            <select className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} >
                {
                    formStates[name] ? null : <option value="notSelected">Select:</option> // only show this if nothing else is selected
                }
                {Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) =>
                    <option key={k} value={v}>
                        {capitalize(undoCamelCase(v))}
                    </option>
                )}
            </select>
        </>

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
            newProps.type = "checkbox";
            newProps.required = false;
            newProps.checked = formStates[name];
            newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.checked);
        default:
            break;
    }

    return <>
        {outLabel}
        <input className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} {...newProps} />
    </>;
}

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
            if (v.enum !== undefined && !v.enum.includes(cleanedinputData[k])) return perElementErrors[k] = `Please select a valid value`

            // finally, if nothing took care of it, show this generic error
            if (cleanedinputData[k] === undefined) return errors.valuesAreRequired = "Please make sure you have specified all the required values";

            out[k] = cleanedinputData[k]
        })
    }

    applySpecialConsiderations(fieldStructure, cleanedOutputData);

    return [errors, perElementErrors, cleanedOutputData];
}
