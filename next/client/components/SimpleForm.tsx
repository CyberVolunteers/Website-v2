import { Flattened } from "combined-validator";
import React, { FormEvent, useState } from "react";
import { FormState, PerElementValidatorCallbacks } from "./FormComponent";
import FormFieldCollection from "./FormFieldCollection";
import FormFieldCollectionErrorHeader from "./FormFieldCollectionErrorHeader";
import { FC } from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const SimpleForm: FC<{
	fields: Flattened;
	perElementValidationCallbacks?: PerElementValidatorCallbacks;
	presentableNames?: { [key: string]: string };
	onSubmit: (
		evt: FormEvent<HTMLFormElement>,
		data: {
			[key: string]: any;
		}
	) => Promise<void>;
	overallErrors: {
		[key: string]: string;
	};
	setOverallErrors: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
}> = ({
	fields,
	perElementValidationCallbacks,
	overallErrors,
	setOverallErrors,
	presentableNames,
	onSubmit,
	children,
}) => {
	const [formState, setFormState] = useState({} as FormState);
	const [areThereFormErrors, setAreThereFormErrors] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	function preSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (isLoading) return; // do not submit the form twice in a row

		if (areThereFormErrors) return;

		setIsLoading(true);
		onSubmit(
			evt,
			formState as {
				[k: string]: FormState;
			}
		).then(() => setIsLoading(false));
	}

	return (
		<form onSubmit={preSubmit}>
			<FormFieldCollectionErrorHeader overallErrors={overallErrors} />
			<FormFieldCollection
				fields={fields}
				presentableNames={presentableNames}
				perElementValidationCallbacks={perElementValidationCallbacks}
				formState={formState}
				setFormState={setFormState}
				setHasErrors={setAreThereFormErrors}
				freezeValidation={isLoading}
				onChange={() => setOverallErrors({})} // remove errors
			/>
			<p>
				<button className="submit" type="submit">
					{children}
				</button>
			</p>
			{isLoading ? <CircularProgress /> : null}
		</form>
	);
};

export default SimpleForm;
