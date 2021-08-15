import { Flattened } from "combined-validator";
import { MutableRefObject, useEffect } from "react";
import { useRef } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { Dispatch, SetStateAction } from "react";
import FormComponent, { PerElementValidatorCallbacks } from "./FormComponent";

const FormFieldCollection = forwardRef((
    { fields, perElementValidationCallbacks, overallErrors, setOverallErrors, presentableNames }:
        {
            fields: Flattened,
            perElementValidationCallbacks?: PerElementValidatorCallbacks,
            presentableNames?: { [key: string]: string },
            overallErrors: {
                [key: string]: string
            },
            setOverallErrors: Dispatch<SetStateAction<{
                [key: string]: string;
            }>>
        }
    , ref) => {

    // refs
    const fieldRef = useRef<typeof FormComponent>();
    // const fieldRefs = {} as {
    //     [key: string]: MutableRefObject<typeof FormComponent | undefined>
    // };
    // Object.entries(fields).forEach(([k, v]) => {
    //     fieldRefs[k] = (useRef<typeof FormComponent>())
    // });

    // useImperativeHandle(ref, () => {
    //     return {
    //         getData: (): { [key: string]: any } | null => {
    //             // if (!formRef.current?.checkValidity()) return null;

    //             //TODO: don't resubmit without change
    //             //  do not submit if there is an error
    //             const allCorrect = Object.entries(fieldRefs).every(([k, v]) => (v.current as any)?.doesHaveNoErrors() === true);
    //             if (!allCorrect) return null;

    //             // TODO: highlight those errors 
    //             if (Object.keys(overallErrors).length !== 0) return null;

    //             // get data
    //             const cleanedData = {} as { [key: string]: any };
    //             const newErrors = Object.assign({}, overallErrors);
    //             let noErrorsFound = true;
    //             Object.entries(fieldRefs).forEach(([k, v]) => {
    //                 try {
    //                     const data = (v.current as any)?.getData()
    //                     if (data !== undefined) cleanedData[k] = data;
    //                 } catch (e) {
    //                     noErrorsFound = false;
    //                     newErrors[k] = e.message;
    //                     setOverallErrors(newErrors);
    //                 }
    //             })
    //             // actual request
    //             if (!noErrorsFound) return null;

    //             return cleanedData;
    //         }
    //     }
    // })



    return <>
        <FormComponent ref={fieldRef}
            name="_root"
            flattenedValue={{ type: fields, required: true}}
            perElementValidationCallbacks={perElementValidationCallbacks ?? {}}
            presentableNames={presentableNames}
            onChange={() => setOverallErrors({})} 
            root={fieldRef}
            /> {/* delete the error messages on field change*/}
    </>
})

export default FormFieldCollection
