import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { FormEvent, ReactElement, useState } from "react";
import { users as userFieldSpec } from "../serverAndClient/publicFieldConstants";
import { flatten, Flattened } from "combined-validator";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import SimpleForm from "../client/components/SimpleForm";
import { useRouter } from "next/dist/client/router";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";
import { addError, createIsEmailIsAvailableValidator, setFieldsOrder } from "../client/utils/formUtils";
import { FormFieldCollectionData } from "../client/types";
import Head from "../client/components/Head";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";
import { isDateInPast } from "../serverAndClient/validation";


export default function UserSignup({ csrfToken, fields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	fields.password2 = {
		required: true,
		type: "string"
	}
	fields.password.isPassword = true;
	fields.email.isEmail = true;
	fields.password2.isPassword = true;
	const signupFields = setFieldsOrder(fields, ["email", "password", "password2"], true);

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
		email: [isEmail, createIsEmailIsAvailableValidator(overallErrors, setOverallErrors)],
		phoneNumber: isMobilePhone,
		birthDate: isDateInPast,
	};

	async function onSubmit(evt: FormEvent<HTMLFormElement>, data: FormFieldCollectionData) {
		if (data.password !== data.password2) return addError(overallErrors, setOverallErrors, "userSignupPasswordEqual", "The two passwords do not match");
		delete data.password2;
		const res = await csrfFetch(csrfToken, "/api/signupUser", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify(data)
		});

		if (!await updateOverallErrorsForRequests(res, "userSignupPost", overallErrors, setOverallErrors)) return;
		router.push("/login");
	}

	return <div>
		<Head title="Sign up as a volunteer - cybervolunteers" />

		<p>Hello and welcome to my secure website</p>

		<SimpleForm fields={signupFields} onSubmit={onSubmit} presentableNames={userFieldNamesToShow} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} >Sign up!</SimpleForm>
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
	fields: Flattened
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			fields: flatten(userFieldSpec)
		}, // will be passed to the page component as props
	};
};
