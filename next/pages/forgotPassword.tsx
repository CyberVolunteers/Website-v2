import {
	FieldConstraintsCollection,
	flatten,
	Flattened,
} from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, ReactElement } from "react";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { FormFieldCollectionData } from "../client/types";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { updateLoginState } from "../client/utils/userState";
import { updateCsrf } from "../server/csrf";
import { loginSpec } from "../serverAndClient/publicFieldConstants";
import Head from "../client/components/Head";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";
import SimpleForm from "../client/components/SimpleForm";
import Link from "next/link";
import { csrfFetch } from "../client/utils/csrf";
import { getSignupPerElementValidationCallbacks } from "../client/components/Signup";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";

export default function ForgotPassword({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState(
		{} as {
			[key: string]: string;
		}
	);

	const [showEmailSentMessage, setShowEmailSentMessage] = useState(false);

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
		email: (v: string) => isEmail(v),
	};

	const fields = flatten({
		required: {
			string: {
				email: { isEmail: true },
			},
		},
	} as FieldConstraintsCollection);

	async function onSubmit(
		evt: FormEvent<HTMLFormElement>,
		data: FormFieldCollectionData
	) {
		setShowEmailSentMessage(false);
		const res = await csrfFetch(csrfToken, "/api/forgotPassword", {
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
				"forgotPasswordPost",
				overallErrors,
				setOverallErrors
			))
		)
			return;

		setShowEmailSentMessage(true);
	}

	return (
		<div>
			<Head title="Forgot my password - cybervolunteers" />
			Hello and welcome to my secure website
			<br />
			<SimpleForm
				fields={fields}
				onSubmit={onSubmit}
				presentableNames={userFieldNamesToShow}
				perElementValidationCallbacks={perElementValidationCallbacks}
				overallErrors={overallErrors}
				setOverallErrors={setOverallErrors}
				onChange={() => setShowEmailSentMessage(false)}
			>
				Send an email to reset the password to this email address
			</SimpleForm>
			{showEmailSentMessage ? (
				<p>An email has been sent to that address</p>
			) : null}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
