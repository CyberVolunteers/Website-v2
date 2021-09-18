import { capitalize } from "@material-ui/core";
import { FlattenedValue } from "combined-validator";
import { useEffect } from "react";
import { ReactElement } from "react";
import { Dispatch, SetStateAction } from "react";
import { ChangeEvent, useState } from "react";
import { undoCamelCase } from "../utils/misc";

type PerElementValidatorCallbackReturnType = boolean | string;
export type FormState =
	| string
	| boolean
	| { [k: string]: FormState }
	| string[];
export type PerElementValidatorCallback = (
	v: any,
	rootState: any
) =>
	| PerElementValidatorCallbackReturnType
	| Promise<PerElementValidatorCallbackReturnType>;
export type PerElementValidatorCallbacks = {
	[k: string]: PerElementValidatorCallback | PerElementValidatorCallback[];
};
export type FormErrorsDescription = {
	localErrorComponentsList: { [key: string]: string };
	globalErrors: {
		[key: string]: string; // currently not used
	};
};

export type FormPropsType = {
	name: string;
	flattenedValue: FlattenedValue;
	perElementValidationCallbacks: PerElementValidatorCallbacks;
	presentableNames?: { [key: string]: string };
	useLabel?: boolean;
	freezeValidation?: boolean;
};

export const getPresentableName = (
	v: string,
	presentableNames?: { [key: string]: string }
) => presentableNames?.[v] ?? capitalize(undoCamelCase(v));

export const getInitFormState = (flattenedVal: FlattenedValue) => {
	return flattenedVal.array === true
		? ([] as string[])
		: flattenedVal.type === "boolean"
		? false
		: typeof flattenedVal.type === "string"
		? ""
		: ({} as { [k: string]: FormState });
};

// TODO: send global errors + do not allow submitting with a global error
function FormComponent(
	props: FormPropsType & {
		formState: FormState;
		setAreThereLocalErrors: Dispatch<SetStateAction<boolean>>;
		// setGlobalErrors: Dispatch<SetStateAction<{[key: string]: string}>>, //TODO: do this
		setFormState: Dispatch<SetStateAction<FormState>>;
		rootFormState?: FormState; // NOTE: this is set internally, do not touch!
	}
	// TODO: maybe merge those two components?
): ReactElement {
	const {
		name,
		flattenedValue,
		presentableNames,
		useLabel,
		rootFormState,
		formState,
		setFormState,
		setAreThereLocalErrors,
	} = props;

	const [errorMessage, setErrorMessage] = useState(null as string | null); // use state so that it updates with the child element
	const [errors, setErrors] = useState({
		localErrorComponentsList: {},
		globalErrors: {},
	} as FormErrorsDescription);

	// make sure to keep this up-to-date
	useEffect(() => {
		const areThereLocalErrors =
			Object.keys(errors.localErrorComponentsList).length !== 0;
		setAreThereLocalErrors(areThereLocalErrors);
	}, [errors]);

	const guaranteedRootFormState =
		rootFormState === undefined ? formState : rootFormState;

	const outLabel = (
		<label htmlFor={name}>
			{getPresentableName(name, presentableNames)}{" "}
			{flattenedValue.required ? "(required)" : null}
		</label>
	);

	return (
		<span>
			{/* Hide underscored values */}
			{useLabel === false ? null : outLabel}
			<InputElement
				{...props}
				setErrorMessage={setErrorMessage}
				formState={formState}
				setFormState={setFormState}
				errors={errors}
				setErrors={setErrors}
				setAreThereLocalErrors={setAreThereLocalErrors}
				// overwrite
				rootFormState={guaranteedRootFormState}
			/>
			{errorMessage} {/* If it is null, it will be ignored */}
		</span>
	);
}

export default FormComponent;

function InputElement(
	props: FormPropsType & {
		errors: FormErrorsDescription;
		setAreThereLocalErrors: Dispatch<SetStateAction<boolean>>;
		setErrors: Dispatch<SetStateAction<FormErrorsDescription>>;
		setErrorMessage: Dispatch<SetStateAction<null | string>>;
		formState: FormState;
		setFormState: Dispatch<SetStateAction<FormState>>;
		rootFormState: FormState;
	}
) {
	const {
		name,
		flattenedValue,
		perElementValidationCallbacks,
		presentableNames,
		errors,
		setErrors,
		setErrorMessage,
		setFormState,
		formState: rawFormState,
		rootFormState,
		setAreThereLocalErrors,
		freezeValidation,
	} = props;

	const [isFirstUpdate, setIsFirstUpdate] = useState(true);

	const validationCallback = connectPerElementValidator({
		uniqueName: name, // TODO: something more unique
		errors,
		setErrors,
		presentableNames,
		flattenedValue,
		rootFormState,
		setErrorMessage,
		callbacks: perElementValidationCallbacks[name],
	});

	const inputType = flattenedValue.type;

	// nested things
	if (typeof inputType !== "string") {
		// we should not use states in if statements, but here we know that the inputType should be constant
		// could be using a set for this, but i'm not too sure how well that would work
		const [childrenWithLocalErrors, setChildrenWithLocalErrors] = useState(
			{} as { [key: string]: boolean }
		);
		// TODO: hook up form state and errors
		if (typeof rawFormState !== "object" || Array.isArray(rawFormState))
			return null;

		let formState: { [key: string]: FormState };
		// initial value for every key
		if (Object.keys(rawFormState).length === 0) {
			const initState: FormState = {};
			Object.entries(inputType).forEach(([newName, newFlattenedVal]) => {
				initState[newName] = getInitFormState(newFlattenedVal);
			});

			//NOTE: because of this, the formState is not set properly until the daughter components update the value

			// set the form state to be what we expect
			formState = initState;
		} else formState = rawFormState;

		function createFormStateSetter(key: string) {
			return ((value: FormState) => {
				// create a copy
				const copy = Object.assign({}, formState) as { [k: string]: FormState };
				copy[key] = value;
				setFormState(copy);
			}) as Dispatch<SetStateAction<FormState>>;
		}

		function createAreThereLocalErrorsSetter(name: string) {
			return function (v: boolean) {
				const childrenWithLocalErrorsCopy = Object.assign(
					{},
					childrenWithLocalErrors
				);

				if (v) childrenWithLocalErrorsCopy[name] = true;
				else delete childrenWithLocalErrorsCopy[name];

				setChildrenWithLocalErrors(childrenWithLocalErrorsCopy);

				setAreThereLocalErrors(
					Object.keys(childrenWithLocalErrorsCopy).length !== 0
				);
			} as Dispatch<SetStateAction<boolean>>;
		}

		return (
			<>
				{Object.entries(inputType).map(([newName, newFlattenedVal]) => {
					return (
						<span key={newName}>
							<FormComponent
								name={newName}
								flattenedValue={newFlattenedVal}
								formState={formState[newName]}
								setFormState={createFormStateSetter(newName)}
								setAreThereLocalErrors={createAreThereLocalErrorsSetter(
									newName
								)}
								rootFormState={rootFormState}
								freezeValidation={freezeValidation}
								{...{ perElementValidationCallbacks, presentableNames }}
							/>
							<br />
						</span>
					);
				})}
			</>
		);
	}

	function validate(v: any) {
		if (freezeValidation !== true && validationCallback !== null) {
			if (flattenedValue.array === true) {
				v.forEach((subVal: any) => {
					validationCallback(name, subVal, isFirstUpdate);
				});
			} else {
				validationCallback(name, v, isFirstUpdate);
			}
		}
	}

	function setValue(v: any) {
		setIsFirstUpdate(false);
		validate(v);
		setFormState(v); // do it straight away for responsiveness
	}

	// validate it on update
	useEffect(() => {
		validate(rawFormState);
	}, [rawFormState]);

	if (inputType === "string" && flattenedValue.array === true)
		return <MultiText {...props} setValue={setValue} />;
	if (flattenedValue.enum !== undefined) {
		if (flattenedValue.array === true)
			return <MultiSelect {...props} setValue={setValue} />;
		else return <DropdownComponent {...props} setValue={setValue} />;
	}

	return (
		<PrimitiveFormComponent
			{...props}
			inputType={inputType}
			setValue={setValue}
		/>
	);
}

function MultiText({
	flattenedValue,
	formState,
	setValue,
	presentableNames,
}: {
	flattenedValue: FlattenedValue;
	formState: FormState;
	setValue: (v: any) => void;
	presentableNames?: { [key: string]: string };
}) {
	if (!Array.isArray(formState)) throw Error("Invalid form state type");
	return (
		<span>
			{formState.map((v: string, i: number) => {
				return (
					<span key={i}>
						<br />

						<input
							value={v}
							onChange={(e) => {
								const newVal = e.target.value;
								const arrayCopy = [...formState];
								arrayCopy[i] = newVal;
								setValue(arrayCopy);
							}}
						></input>
						{formState.length === 1 ? null : (
							<span
								onClick={() => {
									const arrayCopy = [...formState];
									arrayCopy.splice(i, 1); // delete the current element
									setValue(arrayCopy);
								}}
							>
								{"<minus sign>"}
							</span>
						)}

						{/* <span
							style={{
								textDecoration: formState.includes(v) ? "underline" : "none",
								cursor: "pointer",
							}}
							onClick={() => {
								const newState = [...formState]; // clone
								const index = newState.indexOf(v);
								// delete or add
								if (index !== -1) newState.splice(index, 1);
								else newState.push(v);
								setValue(newState);
							}}
						>
							{getPresentableName(v, presentableNames)}
						</span>
						<br /> */}
					</span>
				);
			})}
			<br />
			<span
				onClick={() => {
					const arrayCopy = [...formState];
					arrayCopy.push(""); // add a new element
					setValue(arrayCopy);
				}}
			>
				{"<plus sign>"}
			</span>
		</span>
	);
}

function MultiSelect({
	flattenedValue,
	formState,
	setValue,
	presentableNames,
}: {
	flattenedValue: FlattenedValue;
	formState: FormState;
	setValue: (v: any) => void;
	presentableNames?: { [key: string]: string };
}) {
	if (!Array.isArray(formState)) throw Error("Invalid form state type");
	return (
		<span>
			<br />
			{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) => {
				return (
					<span key={k}>
						<span
							style={{
								textDecoration: formState.includes(v) ? "underline" : "none",
								cursor: "pointer",
							}}
							onClick={() => {
								const newState = [...formState]; // clone
								const index = newState.indexOf(v);
								// delete or add
								if (index !== -1) newState.splice(index, 1);
								else newState.push(v);
								setValue(newState);
							}}
						>
							{getPresentableName(v, presentableNames)}
						</span>
						<br />
					</span>
				);
			})}
		</span>
	);
}

function DropdownComponent({
	name,
	flattenedValue,
	formState,
	presentableNames,
	setValue,
}: {
	name: string;
	flattenedValue: FlattenedValue;
	formState: FormState;
	presentableNames?: { [key: string]: string };
	setValue: (v: any) => void;
}) {
	return (
		<select
			className={name}
			name={name}
			required={flattenedValue.required}
			value={formState as string}
			onChange={(e) => setValue(e.target.value)}
		>
			{
				formState === "" || !flattenedValue.required ? (
					<option value="notSelected">Select:</option>
				) : null // only show this if nothing else is selected
			}
			{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) => (
				<option key={k} value={v}>
					{getPresentableName(v, presentableNames)}
				</option>
			))}
		</select>
	);
}

function PrimitiveFormComponent({
	name,
	flattenedValue,
	inputType,
	formState,
	setValue,
}: {
	name: string;
	flattenedValue: FlattenedValue;
	inputType: string;
	formState: FormState;
	setValue: (v: any) => void;
}) {
	const newProps: any = {};

	switch (inputType) {
		case "string":
			newProps.type = flattenedValue.isEmail
				? "email"
				: flattenedValue.isPassword
				? "password"
				: "text";
			newProps.maxLength = flattenedValue?.maxLength;
			if (flattenedValue.isPhoneNumber)
				newProps.onChange = (e: ChangeEvent<HTMLInputElement>) =>
					setValue(e.target.value.replace(/[^\d\.\-\+]/g, "")); // remove non-digits and others that are not suitable

			break;

		case "number":
			newProps.type = "text";
			newProps.pattern = "[\\d\\.-]*";
			newProps.title = "Please enter a number";
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) =>
				setValue(e.target.value.replace(/[^\d\.\-]/g, "")); // remove non-digits and others that are not suitable
			break;

		case "date":
			newProps.type = "date";
			break;

		case "boolean":
			newProps.type = "checkbox";
			newProps.required = false;
			newProps.checked = formState;
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) =>
				setValue(e.target.checked);
		default:
			break;
	}

	return (
		<>
			<input
				className={name}
				id={name}
				name={name}
				required={flattenedValue.required}
				value={formState}
				onChange={(e) => setValue(e.target.value)}
				{...newProps}
			/>
		</>
	);
}

function connectPerElementValidator(props: {
	uniqueName: string;
	presentableNames:
		| {
				[key: string]: string;
		  }
		| undefined;
	flattenedValue: FlattenedValue;
	rootFormState: FormState;
	setErrorMessage: Dispatch<SetStateAction<string | null>>;
	callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[];
	errors: FormErrorsDescription;
	setErrors: Dispatch<SetStateAction<FormErrorsDescription>>;
}) {
	const {
		uniqueName,
		presentableNames,
		flattenedValue,
		rootFormState,
		setErrorMessage,
		callbacks: rawCallbacks,
		errors,
		setErrors,
	} = props;
	if (rawCallbacks === undefined) return null;

	// make it an array
	const callbacks = !Array.isArray(rawCallbacks)
		? [rawCallbacks]
		: rawCallbacks;

	return async (k: string, v: any, isFirstUpdate: boolean) => {
		let hasPassed = true;
		// default message
		let reason = `Please enter a valid value for ${getPresentableName(
			k,
			presentableNames
		).toLocaleLowerCase()}`;

		try {
			// if empty and not required, don't bother
			// do not return early - what if we add something below in the future?
			if (flattenedValue.required || v !== "") {
				// check that all promises are fulfilled

				// the parallel way
				// it calls everything - we don't want that many calls to the endpoint
				// TODO: maybe detect sync vs async?
				// const promisesToCheck = (callbacks as PerElementValidatorCallback[]).map(async (cb) => await cb(v));
				// const results = await Promise.all(promisesToCheck);
				// hasPassed = results.every(v => v);

				// the serial way
				for (let cb of callbacks as PerElementValidatorCallback[]) {
					// we are passing a copy so that it doesn't get changed
					const result = await cb(v, Object.assign({}, rootFormState));

					if (result === false) {
						hasPassed = false;
						break;
					}
					if (typeof result === "string") {
						hasPassed = false;
						reason = result;
						break;
					}
				}
			} else if (flattenedValue.required && v === "") hasPassed = false;
		} catch (e: any) {
			hasPassed = false;
			reason = e.message;
		}

		const newMsg = hasPassed ? null : reason;

		if (isFirstUpdate === false) setErrorMessage(newMsg);

		// now check that the errors object is up to date
		const errorsCopy: FormErrorsDescription = {
			localErrorComponentsList: Object.assign(
				{},
				errors.localErrorComponentsList
			),
			globalErrors: Object.assign({}, errors.globalErrors),
		};

		if (newMsg === null) delete errorsCopy.localErrorComponentsList[uniqueName];
		else errorsCopy.localErrorComponentsList[uniqueName] = newMsg;

		// check if those objects are the same to prevent unnecessary updates
		const areEqual =
			errorsCopy.localErrorComponentsList[uniqueName] ===
			errors.localErrorComponentsList[uniqueName];

		if (!areEqual) setErrors(errorsCopy);

		return hasPassed;
	};
}
