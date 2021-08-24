import { capitalize } from "@material-ui/core";
import { FlattenedValue } from "combined-validator";
import { ForwardedRef } from "react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ChangeEvent, useState, forwardRef, useImperativeHandle } from "react";
import { undoCamelCase } from "../utils/misc";

type PerElementValidatorCallbackReturnType = boolean | string;
export type PerElementValidatorCallback = (
	v: any,
	root: any
) =>
	| PerElementValidatorCallbackReturnType
	| Promise<PerElementValidatorCallbackReturnType>;
export type PerElementValidatorCallbacks = {
	[k: string]: PerElementValidatorCallback | PerElementValidatorCallback[];
};

const getPresentableName = (
	v: string,
	presentableNames?: { [key: string]: string }
) => presentableNames?.[v] ?? capitalize(undoCamelCase(v));

export type PropsType = {
	useLabel?: boolean;
	name: string;
	flattenedValue: FlattenedValue;
	perElementValidationCallbacks: PerElementValidatorCallbacks;
	presentableNames?: { [key: string]: string };
	onChange?: (name: string, newVal: any, root: any) => void;
	root: any;
};

const FormComponent = forwardRef((props: PropsType, ref) => {
	const { name, flattenedValue, presentableNames, useLabel } = props;

	const [elementError, setElementError] = useState("");

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
				ref={ref}
				{...props}
				elementError={elementError}
				setElementError={setElementError}
			/>
			{elementError === "" ? null : <span>{elementError}</span>}
		</span>
	);
});

export default FormComponent;

const InputElement = forwardRef(
	(
		props: PropsType & {
			elementError: string;
			setElementError: Dispatch<SetStateAction<string>>;
		},
		ref
	) => {
		const {
			name,
			flattenedValue,
			perElementValidationCallbacks,
			presentableNames,
			elementError,
			setElementError,
			onChange,
			root,
		} = props;

		const [formState, formStateSetter] = useState(
			flattenedValue.array === true
				? ([] as any[])
				: flattenedValue.type === "boolean"
				? false
				: typeof flattenedValue.type !== "string"
				? ({} as { [k: string]: any })
				: ""
		);

		function connectPerElementValidator(
			callbacks?: PerElementValidatorCallback | PerElementValidatorCallback[]
		) {
			if (callbacks === undefined) return undefined;

			if (!Array.isArray(callbacks)) callbacks = [callbacks];

			return async (k: string, v: any) => {
				let hasPassed = true;
				let message = `Please enter a valid value for ${getPresentableName(
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
							const result = await cb(v, root?.current);

							if (result === false) {
								hasPassed = false;
								break;
							}
							if (typeof result === "string") {
								hasPassed = false;
								message = result;
								break;
							}
						}
					}
				} catch (e) {
					hasPassed = false;
					message = e.message;
				}

				const newMsg = hasPassed ? "" : message;
				if (newMsg !== elementError) setElementError(newMsg);

				return hasPassed;
			};
		}

		const validationCallback = connectPerElementValidator(
			perElementValidationCallbacks[name]
		);

		const inputType = flattenedValue.type;

		const baseRefProps = {
			formState,
		} as { [key: string]: any };

		// nested things
		if (typeof inputType !== "string") {
			const nestedRefs = Object.fromEntries(
				Object.entries(inputType).map(([k, v]) => [k, useRef<any>()])
			);

			function hasNoErrors() {
				return Object.entries(nestedRefs).every(([k, r]) =>
					(r as any)?.current?.hasNoErrors()
				);
			}

			useImperativeHandle(ref, () => ({
				getData: () => {
					if (!hasNoErrors()) return null;
					const out: { [key: string]: any } = {};
					Object.entries(nestedRefs).forEach(([k, v]) => {
						const state = v?.current?.formState;
						if (state !== "") out[k] = v?.current?.getData?.();
					});
					return out;
				},
				hasNoErrors,
				getChild: (name: string) => nestedRefs[name]?.current,
				nestedRefs,
				...baseRefProps,
			}));

			return (
				<>
					{Object.entries(inputType).map(([newName, newVal]) => {
						return (
							<span key={newName}>
								<FormComponent
									ref={nestedRefs[newName]}
									name={newName}
									flattenedValue={newVal}
									{...{ perElementValidationCallbacks, presentableNames }}
									onChange={onChange}
									root={root}
								/>
								<br />
							</span>
						);
					})}
				</>
			);
		}

		// validation checks
		function validate(state?: typeof formState) {
			if (state === undefined) state = formState;
			if (validationCallback !== undefined) validationCallback(name, state);
		}

		baseRefProps.validate = validate;
		baseRefProps.hasNoErrors = () => elementError === "";

		function setValue(v: any) {
			formStateSetter(v); // do it straight away for responsiveness
			validate(v);
		}

		useEffect(() => {
			onChange?.(name, formState, root?.current); // so that the value actually updates
		}, [formState]);

		if (flattenedValue.enum !== undefined) {
			if (flattenedValue.array === true)
				return (
					<MultiSelect
						ref={ref}
						{...props}
						formState={formState as any[]}
						setValue={setValue}
						baseRefProps={baseRefProps}
					/>
				);
			else
				return (
					<DropdownComponent
						ref={ref}
						{...props}
						setValue={setValue}
						formState={formState}
						baseRefProps={baseRefProps}
					/>
				);
		}

		return (
			<PrimitiveFormComponent
				ref={ref}
				{...props}
				inputType={inputType}
				setValue={setValue}
				formState={formState as any[]}
				baseRefProps={baseRefProps}
			/>
		);
	}
);

const MultiSelect = forwardRef(
	(
		{
			name,
			flattenedValue,
			formState,
			setValue,
			presentableNames,
			baseRefProps,
		}: {
			name: string;
			flattenedValue: FlattenedValue;
			formState: any[];
			setValue: (v: any) => void;
			presentableNames?: { [key: string]: string };
			baseRefProps: { [key: string]: any };
		},
		ref
	) => {
		useImperativeHandle(ref, () => ({
			getData: () => {
				return formState;
			},
			...baseRefProps,
		}));
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
);

const DropdownComponent = forwardRef(
	(
		{
			name,
			flattenedValue,
			formState,
			presentableNames,
			setValue,
			baseRefProps,
		}: {
			name: string;
			flattenedValue: FlattenedValue;
			formState: any;
			presentableNames?: { [key: string]: string };
			setValue: (v: any) => void;
			baseRefProps: { [key: string]: any };
		},
		ref
	) => {
		const elementRef = useRef<HTMLSelectElement>();
		useImperativeHandle(ref, () => ({
			elementRef,
			getData: () => {
				// a check to make sure
				if (!flattenedValue.enum.includes(formState)) return null;
				return formState;
			},
			...baseRefProps,
		}));
		return (
			<select
				ref={elementRef as ForwardedRef<HTMLSelectElement>}
				className={name}
				name={name}
				required={flattenedValue.required}
				value={formState}
				onChange={(e) => setValue(e.target.value)}
			>
				{
					formState ? null : <option value="notSelected">Select:</option> // only show this if nothing else is selected
				}
				{Object.entries(flattenedValue.enum).map(([k, v]: [string, any]) => (
					<option key={k} value={v}>
						{getPresentableName(v, presentableNames)}
					</option>
				))}
			</select>
		);
	}
);

const PrimitiveFormComponent = forwardRef(
	(
		{
			name,
			flattenedValue,
			inputType,
			formState,
			setValue,
			baseRefProps,
		}: {
			name: string;
			flattenedValue: FlattenedValue;
			inputType: string;
			formState: any;
			setValue: (v: any) => void;
			baseRefProps: { [key: string]: any };
		},
		ref
	) => {
		const elementRef = useRef<HTMLInputElement>();

		useImperativeHandle(ref, () => ({
			elementRef,
			getData: () => {
				switch (inputType) {
					case "date":
						// convert all dates to iso
						// TODO: completely isolate formStates
						formState = new Date(formState as string).toISOString();
						break;
					case "number":
						// convert all number strings to numbers
						const out = parseInt(formState as string);
						if (isNaN(out)) formState = "";
						else formState = out;
						break;
				}
				return formState;
			},
			...baseRefProps,
		}));
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
					ref={elementRef as ForwardedRef<HTMLInputElement>}
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
);
