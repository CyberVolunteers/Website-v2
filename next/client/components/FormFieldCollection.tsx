import { Flattened } from "combined-validator";
import { useEffect } from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import FormComponent, { FormState, PerElementValidatorCallbacks } from "./FormComponent";

function FormFieldCollection({
	fields,
	perElementValidationCallbacks,
	presentableNames,
	setHasErrors,
	formState,
	setFormState,
	freezeValidation,
	onChange,
}: {
	fields: Flattened;
	perElementValidationCallbacks?: PerElementValidatorCallbacks;
	presentableNames?: { [key: string]: string };
	setHasErrors: Dispatch<SetStateAction<boolean>>;
	formState: FormState;
	setFormState: Dispatch<SetStateAction<FormState>>;
	freezeValidation?: boolean;
	onChange?: () => void;
}) {
	const [areThereLocalErrors, setAreThereLocalErrors] = useState(false);

	useEffect(() => {
		setHasErrors(areThereLocalErrors);
	}, [areThereLocalErrors]);

	useEffect(() => {
		onChange?.();
	}, [formState]);

	return (
		<>
			<FormComponent
				name="_root"
				useLabel={false}
				flattenedValue={{ type: fields, required: true }}
				perElementValidationCallbacks={perElementValidationCallbacks ?? {}}
				presentableNames={presentableNames}
				formState={formState}
				setFormState={setFormState}
				setAreThereLocalErrors={setAreThereLocalErrors}
				freezeValidation={freezeValidation}
			/>
		</>
	);
}

export default FormFieldCollection;
