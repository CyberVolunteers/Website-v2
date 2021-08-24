import { Flattened } from "combined-validator";
import { MutableRefObject, useEffect } from "react";
import { useRef } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { Dispatch, SetStateAction } from "react";
import FormComponent, { PerElementValidatorCallbacks } from "./FormComponent";

const FormFieldCollection = forwardRef(
	(
		{
			fields,
			perElementValidationCallbacks,
			overallErrors,
			setOverallErrors,
			presentableNames,
			onChange,
		}: {
			fields: Flattened;
			perElementValidationCallbacks?: PerElementValidatorCallbacks;
			presentableNames?: { [key: string]: string };
			overallErrors: {
				[key: string]: string;
			};
			setOverallErrors: Dispatch<
				SetStateAction<{
					[key: string]: string;
				}>
			>;
			onChange?: (name: string, newVal: any, root: any) => void;
		},
		ref
	) => {
		const guaranteedRef = ref ?? useRef<typeof FormComponent>();

		return (
			<>
				<FormComponent
					ref={guaranteedRef}
					name="_root"
					useLabel={false}
					flattenedValue={{ type: fields, required: true }}
					perElementValidationCallbacks={perElementValidationCallbacks ?? {}}
					presentableNames={presentableNames}
					root={guaranteedRef}
					onChange={(name, newVal, root) => {
						if (overallErrors !== {}) setOverallErrors({}); // do not always trigger a rerender
						onChange?.(name, newVal, root);
					}}
				/>
			</>
		);
	}
);

export default FormFieldCollection;
