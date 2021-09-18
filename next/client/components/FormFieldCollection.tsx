import { Flattened } from "combined-validator";
import { useEffect } from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { prepareFormState } from "../../serverAndClient/utils";
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

	useEffect(() => {
		onChange?.();
	}, [formState]);

	const [internalFormState, setInternalFormState] = useState(formState);

	useEffect(() => {
		setFormState(prepareFormState(internalFormState as {[key: string]: any}, fields));
	}, [internalFormState])

	return (
		<>
			<FormComponent
				name="_root"
				useLabel={false}
				flattenedValue={{ type: fields, required: true }}
				perElementValidationCallbacks={perElementValidationCallbacks ?? {}}
				presentableNames={presentableNames}
				formState={internalFormState}
				setFormState={setInternalFormState}
				setAreThereLocalErrors={setHasErrors}
				freezeValidation={freezeValidation}
			/>
		</>
	);
}

export default FormFieldCollection;
