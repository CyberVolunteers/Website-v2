import { capitalize } from "@material-ui/core";
import { Flattened } from "combined-validator";
import { useRouter } from "next/dist/client/router";
import React, {
	Dispatch,
	FormEvent,
	ReactElement,
	SetStateAction,
} from "react";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isURL from "validator/lib/isURL";
import {
	passwordStrengthSuggestions,
	isDateInPast,
	passwordEquality,
} from "../../serverAndClient/validation";
import { FormFieldCollectionData } from "../types";
import { csrfFetch } from "../utils/csrf";
import { setFieldOrder } from "../utils/formUtils";
import { updateOverallErrorsForRequests } from "../utils/misc";
import { PerElementValidatorCallbacks } from "./FormComponent";
import SimpleForm from "./SimpleForm";

export function getSignupPerElementValidationCallbacks(
	overallErrors: {
		[key: string]: string;
	},
	setOverallErrors: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>,
	additionalData?: {
		allowedEmailAddresses?: string[]
	}
): PerElementValidatorCallbacks {
	return {
		email: [
			(v: string) => isEmail(v),
			createIsEmailIsAvailableValidator(overallErrors, setOverallErrors, additionalData?.allowedEmailAddresses),
		],
		password: passwordStrengthSuggestions,
		password2: passwordEquality,
		phoneNumber: (v: string) => isMobilePhone(v),
		birthDate: isDateInPast,
		websiteUrl: (v: string) => isURL(v),
	};
}

export function Signup({
	csrfToken,
	fields,
	presentableNames,
	target,
}: {
	csrfToken: string;
	fields: Flattened;
	presentableNames?: {
		[key: string]: string;
	};
	target: "user" | "org";
}): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState(
		{} as {
			[key: string]: string;
		}
	);
	const perElementValidationCallbacks = getSignupPerElementValidationCallbacks(
		overallErrors,
		setOverallErrors
	);

	fields.password2 = {
		required: true,
		type: "string",
	};
	fields.password.isPassword = true;
	fields.email.isEmail = true;
	fields.password2.isPassword = true;
	const signupFields = setFieldOrder(
		fields,
		["email", "password", "password2"],
		true
	);

	async function onSubmit(
		evt: FormEvent<HTMLFormElement>,
		data: FormFieldCollectionData
	) {
		delete data.password2;
		const res = await csrfFetch(csrfToken, `/api/signup${capitalize(target)}`, {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(data),
		});

		if (
			!(await updateOverallErrorsForRequests(
				res,
				`${target}SignupPost`,
				overallErrors,
				setOverallErrors
			))
		)
			return;
		router.push("/login");
	}
	return (
		<div>
			<SimpleForm
				fields={signupFields}
				onSubmit={onSubmit}
				presentableNames={presentableNames}
				perElementValidationCallbacks={perElementValidationCallbacks}
				overallErrors={overallErrors}
				setOverallErrors={setOverallErrors}
			>
				Sign up!
			</SimpleForm>
		</div>
	);
}

function createIsEmailIsAvailableValidator(
	overallErrors: {
		[key: string]: string;
	},
	setOverallErrors: Dispatch<
		SetStateAction<{
			[key: string]: string;
		}>
	>,
	allowedEmailAddresses?: string[]
) {
	return async function (email: string) {
		if(allowedEmailAddresses?.includes?.(email)) return true;
		const res = await fetch(
			`/api/isEmailFree?${new URLSearchParams({ email })}`,
			{
				method: "GET",
				credentials: "same-origin", // only send cookies for same-origin requests
				headers: {
					"content-type": "application/json",
					accept: "application/json",
				},
			}
		);

		if (
			!(await updateOverallErrorsForRequests(
				res,
				"isUserEmailAvailable",
				overallErrors,
				setOverallErrors
			))
		)
			return false;

		if ((await res.json()) !== true)
			throw new Error("This email is not available"); // fail-safe - if something goes wrong, it shows the warning
		return true;
	};
}
