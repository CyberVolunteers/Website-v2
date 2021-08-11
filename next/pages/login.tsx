import { flatten, Flattened } from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, ReactElement } from "react";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import AutoConstructedForm from "../client/components/AutoCostructedForm";
import { AutoConstructedFormData } from "../client/types";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { updateLoginState } from "../client/utils/userState";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";
import { loginSpec } from "../serverAndClient/publicFieldConstants";
import Head from "../client/components/Head";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";

export default function Login({ csrfToken, fields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
		email: [isEmail],
	};

	async function onSubmit(evt: FormEvent<HTMLFormElement>, data: AutoConstructedFormData) {
		const res = await csrfFetch(csrfToken, "/api/login", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify(data)
		});

		if (!await updateOverallErrorsForRequests(res, "loginPost", overallErrors, setOverallErrors)) return;

		updateLoginState();
		router.push(typeof router.query.redirect === "string" ? router.query.redirect : "/searchListings"); // redirect
	}

	return <div>
		<Head title="Sign in - cybervolunteers" />

		Hello and welcome to my secure website
		<br />

		<AutoConstructedForm fields={fields} onSubmit={onSubmit} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
	fields: Flattened
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			fields: flatten(loginSpec)
		}, // will be passed to the page component as props
	};
};
