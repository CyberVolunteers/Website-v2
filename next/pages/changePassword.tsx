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
import { useViewProtection } from "../client/utils/otherHooks";

export default function ChangePassword({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user", "unverified_org", "unverified_user"]);
	
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState(
		{} as {
			[key: string]: string;
		}
	);

	const perElementValidationCallbacks: PerElementValidatorCallbacks =
		getSignupPerElementValidationCallbacks(overallErrors, setOverallErrors);

	const fields = flatten({
		required: {
			string: {
				oldPassword: { isPassword: true },
				password: { isPassword: true },
				password2: { isPassword: true },
			},
		},
	} as FieldConstraintsCollection);

	async function onSubmit(
		evt: FormEvent<HTMLFormElement>,
		data: FormFieldCollectionData
	) {
		delete data.password2;

		const res = await csrfFetch(csrfToken, "/api/passResetOldPassKnown", {
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
				"changePasswordPost",
				overallErrors,
				setOverallErrors
			))
		)
			return;

		// log them out
		updateLoginState();
		router.push("login"); // redirect
	}

	return (
		<div>
			<Head title="Forgot password - cybervolunteers" />
			Hello and welcome to my secure website
			<br />
			<SimpleForm
				fields={fields}
				onSubmit={onSubmit}
				presentableNames={userFieldNamesToShow}
				perElementValidationCallbacks={perElementValidationCallbacks}
				overallErrors={overallErrors}
				setOverallErrors={setOverallErrors}
				onChange={(name: string, newVal: any, root: any) => {
					if (name === "password") root?.getChild("password2")?.validate?.();
				}}
			>
				Change my password!
			</SimpleForm>
			<Link href="/forgotPassword" passHref>
				<a>
					<li>
						<p>I forgot my password</p>
					</li>
				</a>
			</Link>
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
