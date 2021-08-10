import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { FormEvent, ReactElement, useState } from "react";
import { users as userFieldSpec } from "../serverAndClient/publicFieldConstants";
import { flatten, Flattened } from "combined-validator";
import isEmail from "validator/lib/isEmail";
import AutoConstructedForm, { PerElementValidatorCallbacks } from "../client/components/AutoCostructedForm";
import { useRouter } from "next/dist/client/router";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";
import { createIsEmailIsAvailableValidator } from "../client/utils/formUtils";
import { AutoConstructedFormData } from "../client/types";
import Head from "../client/components/Head";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";


export default function UserSignup({ csrfToken, signupFields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
		email: [isEmail, createIsEmailIsAvailableValidator(overallErrors, setOverallErrors)],
	};

	async function onSubmit(evt: FormEvent<HTMLFormElement>, data: AutoConstructedFormData) {
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

		<AutoConstructedForm fields={signupFields} onSubmit={onSubmit} presentableNames={userFieldNamesToShow} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
	signupFields: Flattened
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			signupFields: flatten(userFieldSpec)
		}, // will be passed to the page component as props
	};
};
