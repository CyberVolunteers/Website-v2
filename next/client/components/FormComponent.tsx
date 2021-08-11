import { capitalize } from "@material-ui/core";
import { FlattenedValue } from "combined-validator";
import { useRef } from "react";
import { ReactElement, ChangeEvent, useState, forwardRef, useImperativeHandle } from "react";
import { undoCamelCase } from "../utils/misc";

export type PerElementValidatorCallback = (v: any) => boolean | Promise<boolean>;
export type PerElementValidatorCallbacks = { [k: string]: PerElementValidatorCallback | PerElementValidatorCallback[] };

const getPresentableName = (v: string, presentableNames?: { [key: string]: string }) => presentableNames?.[v] ?? capitalize(undoCamelCase(v));

const FormComponent = forwardRef((props: {
	name: string,
	flattenedValue: FlattenedValue,
	formStates: any,
	formStateSetters: any,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	onErrorSet?: (msg: string) => void
}, ref) => {
	const childRef = useRef();
	const [elementError, setElementError] = useState("");

	function connectPerElementValidator(callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[]) {
		if (callbacks === undefined) return undefined;

		if (!Array.isArray(callbacks)) callbacks = [callbacks]

		return async (k: string, v: any) => {
			let hasPassed = true;
			let message = `Please enter a valid value for ${k}`;

			try {
				// check that all promises are fulfilled

				// the parallel way
				// it calls everything - we don't want that many calls to the endpoint
				// TODO: maybe detect sync vs async?
				// const promisesToCheck = (callbacks as PerElementValidatorCallback[]).map(async (cb) => await cb(v));
				// const results = await Promise.all(promisesToCheck);
				// hasPassed = results.every(v => v);

				// the serial way
				for (let cb of (callbacks as PerElementValidatorCallback[])) {
					const result = await cb(v)
					if (!result) { hasPassed = false; break; }
				}

			} catch (e) {
				hasPassed = false;
				message = e.message
			}

			const newMsg = hasPassed ? "" : message;
			if (newMsg !== elementError) {
				setElementError(newMsg);
				props.onErrorSet?.(newMsg)
			}

			return hasPassed
		}
	}

	useImperativeHandle(ref, () => ({
		doesHaveNoErrors: () => {
			return elementError === ""
		},
		getData: () => {
			const newData = (childRef.current as any)?._getData()
			const errorObj = new Error(`Please supply an appropriate value for "${getPresentableName(props.name, props.presentableNames)}"`);
			if(newData === null) throw errorObj
			if (newData === "") {
				if (props.flattenedValue.required) throw errorObj
				else return undefined;
			}

			return newData
		}

	}));

	const outLabel = <label htmlFor={props.name}>{getPresentableName(props.name, props.presentableNames)} {props.flattenedValue.required ? "(required)" : null}</label>

	return <span>
		{outLabel}
		<InputElement ref={childRef} {...props} onErrorSet={setElementError} connectPerElementValidator={connectPerElementValidator} />
		{
			elementError === "" ? null :
				<span>{elementError}</span>
		}
	</span>
})

export default FormComponent;

const InputElement = forwardRef((props: {
	name: string,
	flattenedValue: FlattenedValue,
	formStates: any,
	formStateSetters: any,
	connectPerElementValidator: (callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[] | undefined) => ((k: string, v: any) => Promise<boolean>) | undefined,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	onErrorSet?: (msg: string) => void
}, ref) => {
	const { name,
		flattenedValue,
		formStates,
		formStateSetters,
		connectPerElementValidator,
		perElementValidationCallbacks,
		presentableNames,
	} = props;

	const validationCallback = connectPerElementValidator(perElementValidationCallbacks[name]);

	const inputType = flattenedValue.type;

	// nested things
	if (typeof inputType !== "string") {
		useImperativeHandle(ref, () => ({
			_getData: () => {
				return null
			}
		}));
		return <>
			{Object.entries(inputType).map(([newName, newVal]) => {
				const nestedRef = useRef();
				//TODO: use on error set
				//TODO: test it
				return <span key={newName}>
					<FormComponent name={newName} flattenedValue={newVal} {...{ formStates, formStateSetters, connectPerElementValidator, perElementValidationCallbacks, presentableNames }} />
				</span>
			}
			)}
		</>
	}

	function setValue(v: any) {
		formStateSetters[name]?.(v) // do it straight away for responsiveness
		if (validationCallback !== undefined) { validationCallback(name, v); }
	}

	if (flattenedValue.enum !== undefined) {
		if (flattenedValue.array === true) return <MultiSelect ref={ref} {...props} />
		else return <DropdownComponent ref={ref} {...props} setValue={setValue} />
	}

	return <PrimitiveFormComponent ref={ref} {...props} inputType={inputType} setValue={setValue} />
})

const MultiSelect = forwardRef(({ name, flattenedValue, formStates, formStateSetters, presentableNames }: { name: string, flattenedValue: FlattenedValue, formStates: { [key: string]: any }, formStateSetters: any, presentableNames?: { [key: string]: string } }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			return formStates[name];
		}
	}));
	return <span>
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
	</span>
})

const DropdownComponent = forwardRef(({ name, flattenedValue, formStates, presentableNames, setValue }: { name: string, flattenedValue: FlattenedValue, formStates: { [key: string]: any }, presentableNames?: { [key: string]: string }, setValue: (v: any) => void }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			// a check to make sure 
			if (!flattenedValue.enum.includes(formStates[name])) return null;
			return formStates[name]
		}
	}));
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
})

const PrimitiveFormComponent = forwardRef(({ name, flattenedValue, inputType, formStates, setValue }: { name: string, flattenedValue: FlattenedValue, inputType: string, formStates: { [key: string]: any }, setValue: (v: any) => void }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			switch (inputType) {
				case "date":
					// convert all dates to iso
					// TODO: completely isolate formStates
					formStates[name] = new Date(formStates[name] as string).toISOString()
					break;
				case "number":
					// convert all number strings to numbers
					const out = parseInt(formStates[name] as string)
					if (isNaN(out)) formStates[name] = "";
					else formStates[name] = out;
					break;
			}
			return formStates[name];
		}
	}));
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
})