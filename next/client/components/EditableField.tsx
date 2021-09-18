import { Flattened } from "combined-validator";
import React, { useState } from "react";
import { prepareFormState } from "../../serverAndClient/utils";
import FormComponent, {
	FormState,
	PerElementValidatorCallbacks,
} from "./FormComponent";

export default function EditableField({
	name,
	value,
	presentableNames,
	editableFields,
	perElementValidationCallbacks,
	sendEditRequest,
	isLocked,
}: {
	presentableNames: { [key: string]: string };
	name: string;
	value: string | null;
	editableFields: Flattened;
	perElementValidationCallbacks: PerElementValidatorCallbacks;
	sendEditRequest: (name: string, value: any) => void;
	isLocked?: boolean;
}) {
	const [formState, setFormState] = useState((value ?? "") as FormState);
	const [areThereFormErrors, setAreThereFormErrors] = useState(false);

	const [isCurrentlyEdited, setIsCurrentlyEdited] = useState(false);

	function toggleEdit() {
		// do not allow it to submit if it is locked
		if (isLocked === true) return;
		// submit if needed
		if (isCurrentlyEdited) {
			// a silly workaround
			const processedFormState = prepareFormState(
				{ _root: formState },
				{ _root: editableFields[name] }
			)._root;

			// cancel if it is the same or empty
			if (value !== processedFormState && processedFormState !== "") {
				if (areThereFormErrors) return;
				sendEditRequest(name, processedFormState);
			} else {
				// reset
				setFormState(value ?? "");
			}
		}

		// toggle
		setIsCurrentlyEdited(!isCurrentlyEdited);
	}

	// TODO: do this
	// focus on edit
	// useEffect(() => {
	// 	if (isCurrentlyEdited && currentRef !== undefined) {
	// 		// find the first element ref to be displayed
	// 		const newRef = currentRef?.elementRef?.current;
	// 		newRef?.focus?.(); //TODO: test this with nested

	// 		// try to set it to submit on enter
	// 		if (typeof newRef === "object")
	// 			newRef.onkeypress = (evt: { keyCode: number }) => {
	// 				// only submit on enter
	// 				if (evt.keyCode === 13) toggleEdit();
	// 			};
	// 	}
	// }, [isCurrentlyEdited]);

	return (
		<p key={name}>
			<span>
				{(presentableNames as any)[name] ?? name}:
				{isCurrentlyEdited ? (
					<FormComponent
						presentableNames={presentableNames}
						perElementValidationCallbacks={perElementValidationCallbacks}
						flattenedValue={editableFields[name]}
						name={name}
						useLabel={false}
						formState={formState}
						setFormState={setFormState}
						setAreThereLocalErrors={setAreThereFormErrors}
					></FormComponent>
				) : (
					value ?? "<not specified>"
				)}
			</span>
			{/* check that it can be edited */}
			{(() => {
				if (name in editableFields)
					return (
						<span style={{ cursor: "pointer" }} onClick={toggleEdit}>
							{isLocked === true
								? null
								: isCurrentlyEdited
								? "<submit icon>"
								: "<edit icon>"}
						</span>
					);
			})()}
		</p>
	);
}

function displayValue(value: any) {
	if (Array.isArray(value)) return value.join(", ");
	return value;
}
