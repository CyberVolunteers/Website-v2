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

	useEffect(() => {
		onChange?.();
	}, [formState]);

	const [internalFormState, setInternalFormState] = useState(formState);

	useEffect(() => {
		setFormState(createInitialFormState(internalFormState as {[key: string]: any}, fields));
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



export function createInitialFormState(
	input: { [key: string]: any },
	schema: Flattened
): { [key: string]: any } {
	const out = {} as { [key: string]: any };
	Object.entries(input).forEach(([k, v]) => {
		if (v === ("" as any)) return;

		const type = schema[k]?.type;

		// check if it is a date
		if (schema[k]?.type === "date") v = new Date(v ?? "").toISOString();

		if (
			typeof v === "object" &&
			v !== undefined &&
			v !== null &&
			typeof type !== "string"
		)
			out[k] = createInitialFormState(v, type ?? ({} as Flattened));
		else out[k] = v;
	});
	return out;
}