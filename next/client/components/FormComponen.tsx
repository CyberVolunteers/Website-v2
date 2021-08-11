import { capitalize } from "@material-ui/core";
import { FlattenedValue } from "combined-validator";
import { ReactElement, ChangeEvent } from "react";
import { undoCamelCase } from "../utils/misc";

export type PerElementValidatorCallback = (v: any) => boolean | Promise<boolean>;
export type PerElementValidatorCallbacks = { [k: string]: PerElementValidatorCallback | PerElementValidatorCallback[] };

const getPresentableName = (v: string, presentableNames?: { [key: string]: string }) => presentableNames?.[v] ?? capitalize(undoCamelCase(v));

function FormComponent(props: {
	name: string,
	flattenedValue: FlattenedValue,
	formStates: any,
	formStateSetters: any,
	connectPerElementValidator: (callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[] | undefined) => ((k: string, v: any) => Promise<boolean>) | undefined,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	perElementErrors: { [key: string]: string }
}) {
	const outLabel = <label htmlFor={props.name}>{getPresentableName(props.name, props.presentableNames)} {props.flattenedValue.required ? "(required)" : null}</label>

	return <>
		{outLabel}
		<InputElement {...props} />
		{
			props.perElementErrors[props.name] === undefined ? null :
				<span>{props.perElementErrors[props.name]}</span>
		}
	</>
}

export default FormComponent;

function InputElement(props: {
	name: string,
	flattenedValue: FlattenedValue,
	formStates: any,
	formStateSetters: any,
	connectPerElementValidator: (callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[] | undefined) => ((k: string, v: any) => Promise<boolean>) | undefined,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	perElementErrors: { [key: string]: string }
}): ReactElement {
	const { name,
		flattenedValue,
		formStates,
		formStateSetters,
		connectPerElementValidator,
		perElementValidationCallbacks,
		presentableNames,
		perElementErrors } = props;

	const validationCallback = connectPerElementValidator(perElementValidationCallbacks[name]);

	const inputType = flattenedValue.type;

	// first, nested things
	if (typeof inputType !== "string") return <>
		{Object.entries(inputType).map(([newName, newVal]) => <span key={newName}>
			<FormComponent name={newName} flattenedValue={newVal} {...{ formStates, formStateSetters, connectPerElementValidator, perElementValidationCallbacks, presentableNames, perElementErrors }} />
		</span>
		)}
	</>

	function setValue(v: any) {
		formStateSetters[name]?.(v) // do it straight away for responsiveness
		if (validationCallback !== undefined) { validationCallback(name, v); }
	}

	if (flattenedValue.enum !== undefined) {
		if (flattenedValue.array === true) return <MultiSelect {...props} />
		else return <DropdownComponent {...props} setValue={setValue} />
	}

	return <PrimitiveFormComponent {...props} inputType={inputType} setValue={setValue} />
}

function MultiSelect({ name, flattenedValue, formStates, formStateSetters, presentableNames }: { name: string, flattenedValue: FlattenedValue, formStates: { [key: string]: any }, formStateSetters: any, presentableNames?: { [key: string]: string } }) {
	return <>
		<br />
		{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) => {
			return <span key={k}>

				<span style={{
					textDecoration: formStates[name].includes(v) ? "underline" : "none",
					cursor: "pointer"
				}}
					onClick={() => {
						const newState = [...formStates[name]] // clone
						const index = newState.indexOf(v);
						// delete r add
						if (index !== -1) newState.splice(index, 1)
						else newState.push(v)
						formStateSetters[name]?.(newState)
					}}
				>
					{getPresentableName(v, presentableNames)}
				</span>
				< br />
			</span>
		}
		)}
	</>
}

function DropdownComponent({ name, flattenedValue, formStates, presentableNames, setValue }: { name: string, flattenedValue: FlattenedValue, formStates: { [key: string]: any }, presentableNames?: { [key: string]: string }, setValue: (v: any) => void }) {
	return <select className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} >
		{
			formStates[name] ? null : <option value="notSelected">Select:</option> // only show this if nothing else is selected
		}
		{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) =>
			<option key={k} value={v}>
				{getPresentableName(v, presentableNames)}
			</option>
		)}
	</select>
}

function PrimitiveFormComponent({ name, flattenedValue, inputType, formStates, setValue }: { name: string, flattenedValue: FlattenedValue, inputType: string, formStates: { [key: string]: any }, setValue: (v: any) => void }) {
	const newProps: any = {}

	switch (inputType) {
		case "string":
			newProps.type = ["email", "password"].includes(name) ? name : "text"
			newProps.maxLength = flattenedValue?.maxLength;
			break;

		case "number":
			newProps.type = "text"
			newProps.pattern = "\\d*"
			newProps.title = "Please enter a number"
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value.replace(/[^\d]/g, "")) // remove non-digits
			break;

		case "date":
			newProps.type = "date"
			break;

		case "boolean":
			newProps.type = "checkbox";
			newProps.required = false;
			newProps.checked = formStates[name];
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.checked);
		default:
			break;
	}

	return <>
		<input className={name} name={name} required={flattenedValue.required} value={formStates[name]} onChange={e => setValue(e.target.value)} {...newProps} />
	</>;
}