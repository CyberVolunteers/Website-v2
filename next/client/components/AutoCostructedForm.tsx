import { Flattened } from "combined-validator";
import { MutableRefObject, useEffect } from "react";
import { useRef } from "react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { createRef, RefObject, useState } from "react";
import { FC } from "react";
import FormComponent, { PerElementValidatorCallbacks, PerElementValidatorCallback } from "./FormComponent";

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
    // add states
    function createState(f: Flattened) {
        Object.entries(f).forEach(([k, v]) => {
            if (typeof v.type !== "string") return createState(v.type); // nested
            const [state, stateSetter] = useState(
                v.array === true ? [] :
                    v.type === "boolean" ? false : ""
            )
        })
    }

    createState(fields)

    // refs
    const formRef: RefObject<HTMLFormElement> = createRef();
    const fieldRefs = {} as {
        [key: string]: MutableRefObject<typeof FormComponent | undefined>
    };
    Object.entries(fields).forEach(([k, v]) => {
        fieldRefs[k] = (useRef<typeof FormComponent>())
    });

    function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        if (!formRef.current?.checkValidity()) return;

        //TODO: don't resubmit without change
        //  do not submit if there is an error
        const allCorrect = Object.entries(fieldRefs).every(([k, v]) => (v.current as any)?.doesHaveNoErrors() === true);
        if (!allCorrect) return;

        // TODO: highlight those errors 
        if (Object.keys(overallErrors).length !== 0) return;

        // get data
        const cleanedData = {} as { [key: string]: any };
        const newErrors = Object.assign({}, overallErrors);
        let noErrorsFound = true;
        Object.entries(fieldRefs).forEach(([k, v]) => {
            try {
                const data = (v.current as any)?.getData()
                if (data !== undefined) cleanedData[k] = data;
            } catch (e) {
                noErrorsFound = false;
                newErrors[k] = e.message;
                setOverallErrors(newErrors);
            }
        })
        // actual request
        if (!noErrorsFound) return;

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
                        <FormComponent ref={fieldRefs[k]}
                            name={k}
                            flattenedValue={v}
                            perElementValidationCallbacks={perElementValidationCallbacks}
                            presentableNames={presentableNames}
                            onChange={() => setOverallErrors({})} /> {/* delete the error messages on field change*/}
                    </p>
                })
            }
            <button className="submit" type="submit">Wow, i sure do trust this website!</button>
        </form>
    </>
}

export default AutoConstructedForm
