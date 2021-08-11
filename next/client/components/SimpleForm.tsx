import { Flattened } from "combined-validator"
import React, { FormEvent, Dispatch, SetStateAction, useRef } from "react"
import { PerElementValidatorCallbacks } from "./FormComponent"
import FormFieldCollection from "./FormFieldCollection"
import FormFieldCollectionErrorHeader from "./FormFieldCollectionErrorHeader"
import { FC } from "react";


const SimpleForm: FC<{
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
	}>>,
}> = (
	{ fields, perElementValidationCallbacks, overallErrors, setOverallErrors, presentableNames, onSubmit, children}) => {
		const autoFormRef = useRef();

		function preSubmit(evt: React.FormEvent<HTMLFormElement>) {
			evt.preventDefault();

			const data: { [key: string]: any } | null = (autoFormRef.current as any)?.getData();
			if (data === null) return;
			onSubmit(evt, data);
		}

		return <form onSubmit={preSubmit}>
			<FormFieldCollectionErrorHeader overallErrors={overallErrors} />
			<FormFieldCollection ref={autoFormRef} fields={fields} presentableNames={presentableNames} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
			<button className="submit" type="submit">{children}</button>
		</form>
	}

export default SimpleForm