import { Flattened } from "combined-validator"
import React, { FormEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import { PerElementValidatorCallbacks } from "./FormComponent"
import FormFieldCollection from "./FormFieldCollection"
import FormFieldCollectionErrorHeader from "./FormFieldCollectionErrorHeader"
import { FC } from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"


const SimpleForm: FC<{
	fields: Flattened,
	perElementValidationCallbacks?: PerElementValidatorCallbacks,
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
	{ fields, perElementValidationCallbacks, overallErrors, setOverallErrors, presentableNames, onSubmit, children }) => {
		const autoFormRef = useRef();
		const [isLoading, setIsLoading] = useState(false);

		function preSubmit(evt: React.FormEvent<HTMLFormElement>) {
			evt.preventDefault();
			if(isLoading) return; // do not submit the form twice in a row

			const data: { [key: string]: any } | null = (autoFormRef.current as any)?.getData();
			if (data === null) return;
			setIsLoading(true);
			onSubmit(evt, data).then(() => setIsLoading(false))
		}

		return <form onSubmit={preSubmit}>
			<FormFieldCollectionErrorHeader overallErrors={overallErrors} />
			<FormFieldCollection ref={autoFormRef} fields={fields} presentableNames={presentableNames} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
			<p>
				<button className="submit" type="submit">{children}</button>
			</p>
			{
				isLoading ?
					<CircularProgress /> :
					null
			}
		</form>
	}

export default SimpleForm