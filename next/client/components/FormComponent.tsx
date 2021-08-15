import { capitalize } from "@material-ui/core";
import { FlattenedValue } from "combined-validator";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from "react";
import { ChangeEvent, useState, forwardRef, useImperativeHandle } from "react";
import { undoCamelCase } from "../utils/misc";

type PerElementValidatorCallbackReturnType = boolean | string;
export type PerElementValidatorCallback = (v: any, container: {
	[key: string]: MutableRefObject<any>
}) => PerElementValidatorCallbackReturnType | Promise<PerElementValidatorCallbackReturnType>;
export type PerElementValidatorCallbacks = { [k: string]: PerElementValidatorCallback | PerElementValidatorCallback[] };

const getPresentableName = (v: string, presentableNames?: { [key: string]: string }) => presentableNames?.[v] ?? capitalize(undoCamelCase(v));

const FormComponent = forwardRef((props: {
	name: string,
	flattenedValue: FlattenedValue,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	onErrorSet?: (msg: string) => void,
	onChange?: (newVal: any) => void,
	container: {
		[key: string]: MutableRefObject<any>
	}
}, ref) => {

	const {
		name,
		flattenedValue,
		perElementValidationCallbacks,
		presentableNames,
		onErrorSet,
		onChange,
		container
	} = props;

	const childRef = useRef();
	const [elementError, setElementError] = useState("");
	const [formState, formStateSetter] = useState(
		flattenedValue.array === true ? [] as any[] :
			flattenedValue.type === "boolean" ? false :
				typeof flattenedValue.type !== "string" ? {} as { [k: string]: any; } : ""
	);

	function connectPerElementValidator(callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[]) {
		if (callbacks === undefined) return undefined;

		if (!Array.isArray(callbacks)) callbacks = [callbacks]

		return async (k: string, v: any) => {
			let hasPassed = true;
			let message = `Please enter a valid value for ${getPresentableName(k, presentableNames).toLocaleLowerCase()}`;

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
					for (let cb of (callbacks as PerElementValidatorCallback[])) {
						const result = await cb(v, container);

						if (result === false) { hasPassed = false; break; }
						if (typeof result === "string") { hasPassed = false; message = result; break; }
					}
				}
			} catch (e) {
				hasPassed = false;
				message = e.message
			}

			const newMsg = hasPassed ? "" : message;
			if (newMsg !== elementError) {
				setElementError(newMsg);
				onErrorSet?.(newMsg)
			}

			return hasPassed
		}
	}

	useImperativeHandle(ref, () => ({
		doesHaveNoErrors: () => {
			return elementError === ""
		},
		formState,
		getData: () => {
			const newData = (childRef.current as any)?._getData()
			const errorObj = new Error(`Please supply an appropriate value for "${getPresentableName(name, presentableNames)}"`);
			if (newData === null) throw errorObj
			if (newData === "") {
				if (flattenedValue.required) throw errorObj
				else return undefined;
			}

			return newData
		}

	}));

	const outLabel = <label htmlFor={name}>{getPresentableName(name, presentableNames)} {flattenedValue.required ? "(required)" : null}</label>

	return <span>
		{outLabel}
		<InputElement ref={childRef} {...props} onErrorSet={setElementError} connectPerElementValidator={connectPerElementValidator} onChange={onChange} {...{ formState, formStateSetter }} />
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
	connectPerElementValidator: (callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[] | undefined) => ((k: string, v: any) => Promise<boolean>) | undefined,
	perElementValidationCallbacks: PerElementValidatorCallbacks,
	presentableNames?: { [key: string]: string },
	onErrorSet?: (msg: string) => void,
	onChange?: (newVal: any) => void,
	formState: string | boolean | {
		[k: string]: any;
	},
	formStateSetter: Dispatch<SetStateAction<string | boolean | {
		[k: string]: any;
	}>>
}, ref) => {
	const { name,
		flattenedValue,
		connectPerElementValidator,
		perElementValidationCallbacks,
		presentableNames,
		onChange,
		formState,
		formStateSetter
	} = props;

	const validationCallback = connectPerElementValidator(perElementValidationCallbacks[name]);

	const inputType = flattenedValue.type;

	// nested things
	if (typeof inputType !== "string") {
		const nestedRefs = Object.fromEntries(Object.entries(inputType).map(([k, v]) => [k, useRef<any>()]));

		useImperativeHandle(ref, () => ({
			_getData: () => {
				return formState;
			}
		}));

		console.log(Object.values(nestedRefs).map(v => v.current.formState))
		useEffect(() => {
			const newVals = Object.fromEntries(Object.entries(nestedRefs).map(([k, v]) => [k, v.current.formState]));
			console.log(newVals);
			formStateSetter(newVals);
		}, Object.values(nestedRefs).map(v => v.current.formState))

		return <>
			{Object.entries(inputType).map(([newName, newVal]) => {
				//TODO: use on error set
				//TODO: test if problems in nested components are indeed processed
				return <span key={newName}>
					<FormComponent ref={nestedRefs[newName]} name={newName} flattenedValue={newVal} {...{ connectPerElementValidator, perElementValidationCallbacks, presentableNames }} onChange={onChange} container={nestedRefs} />
				</span>
			}
			)}
		</>
	}

	function setValue(v: any) {
		formStateSetter(v) // do it straight away for responsiveness
		onChange?.(v)
		if (validationCallback !== undefined) { validationCallback(name, v); }
	}

	if (flattenedValue.enum !== undefined) {
		if (flattenedValue.array === true) return <MultiSelect ref={ref} {...props} formState={formState as any[]} formStateSetter={formStateSetter} />
		else return <DropdownComponent ref={ref} {...props} setValue={setValue} formState={formState} />
	}

	return <PrimitiveFormComponent ref={ref} {...props} inputType={inputType} setValue={setValue} formState={formState as any[]} />
})

const MultiSelect = forwardRef(({ name, flattenedValue, formState, formStateSetter, presentableNames }: { name: string, flattenedValue: FlattenedValue, formState: any[], formStateSetter: any, presentableNames?: { [key: string]: string } }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			return formState;
		}
	}));
	return <span>
		<br />
		{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) => {
			return <span key={k}>

				<span style={{
					textDecoration: formState.includes(v) ? "underline" : "none",
					cursor: "pointer"
				}}
					onClick={() => {
						const newState = [...formState] // clone
						const index = newState.indexOf(v);
						// delete r add
						if (index !== -1) newState.splice(index, 1)
						else newState.push(v)
						formStateSetter?.(newState)
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

const DropdownComponent = forwardRef(({ name, flattenedValue, formState, presentableNames, setValue }: { name: string, flattenedValue: FlattenedValue, formState: any, presentableNames?: { [key: string]: string }, setValue: (v: any) => void }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			// a check to make sure 
			if (!flattenedValue.enum.includes(formState)) return null;
			return formState
		}
	}));
	return <select className={name} name={name} required={flattenedValue.required} value={formState} onChange={e => setValue(e.target.value)} >
		{
			formState ? null : <option value="notSelected">Select:</option> // only show this if nothing else is selected
		}
		{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) =>
			<option key={k} value={v}>
				{getPresentableName(v, presentableNames)}
			</option>
		)}
	</select>
})

const PrimitiveFormComponent = forwardRef(({ name, flattenedValue, inputType, formState, setValue }: { name: string, flattenedValue: FlattenedValue, inputType: string, formState: any, setValue: (v: any) => void }, ref) => {
	useImperativeHandle(ref, () => ({
		_getData: () => {
			switch (inputType) {
				case "date":
					// convert all dates to iso
					// TODO: completely isolate formStates
					formState = new Date(formState as string).toISOString()
					break;
				case "number":
					// convert all number strings to numbers
					const out = parseInt(formState as string)
					if (isNaN(out)) formState = "";
					else formState = out;
					break;
			}
			return formState;
		}
	}));
	const newProps: any = {}

	switch (inputType) {
		case "string":
			newProps.type = flattenedValue.isEmail ? "email" :
				flattenedValue.isPassword ? "password" :
					"text"
			newProps.maxLength = flattenedValue?.maxLength;
			break;

		case "number":
			newProps.type = "text"
			newProps.pattern = "\\d*"
			newProps.title = "Please enter a number"
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value.replace(/[^\d\.-]/g, "")) // remove non-digits
			break;

		case "date":
			newProps.type = "date"
			break;

		case "boolean":
			newProps.type = "checkbox";
			newProps.required = false;
			newProps.checked = formState;
			newProps.onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.checked);
		default:
			break;
	}

	return <>
		<input className={name} id={name} name={name} required={flattenedValue.required} value={formState} onChange={e => setValue(e.target.value)} {...newProps} />
	</>;
})