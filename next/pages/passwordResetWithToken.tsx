import Head from "../client/components/Head";
import Link from "next/link";
import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextApiResponse,
} from "next";
import { updateLoginState, useViewerType } from "../client/utils/userState";
import { verifyUUID } from "../server/email/redis";
import { setEmailAsVerified } from "../server/auth/data";
import { getMongo } from "../server/mongo";
import { updateSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import React, { ReactElement, useState } from "react";
import { getSignupPerElementValidationCallbacks } from "../client/components/Signup";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";
import { flatten, FieldConstraintsCollection } from "combined-validator";
import { useRouter } from "next/dist/client/router";
import SimpleForm from "../client/components/SimpleForm";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { FormEvent } from "react";
import { FormFieldCollectionData } from "../client/types";
import { csrfFetch } from "../client/utils/csrf";
import { updateCsrf } from "../server/csrf";

export default function PasswordResetWithToken({
	isSuccessful,
	csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
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

		data.uuid = router.query.uuid;
		data.email = router.query.email;

		const res = await csrfFetch(csrfToken, "/api/passwordResetWithToken", {
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
				"passwordResetWithTokenPost",
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
			<Head
				title={`${
					isSuccessful ? "Reset your password" : "Something went wrong"
				} - cybervolunteers`}
			/>

			{isSuccessful ? (
				<>
					<h1>Please enter a new password:</h1>
					<SimpleForm
						fields={fields}
						onSubmit={onSubmit}
						presentableNames={userFieldNamesToShow}
						perElementValidationCallbacks={perElementValidationCallbacks}
						overallErrors={overallErrors}
						setOverallErrors={setOverallErrors}
						onChange={(name: string, newVal: any, root: any) => {
							if (name === "password")
								root?.getChild("password2")?.validate?.();
						}}
					>
						Change my password!
					</SimpleForm>
				</>
			) : (
				<>
					<h1>Something is wrong with this link</h1>
					<h3>
						It is possible that this is because the link you used is too old.
						Please try again
					</h3>
					<h3>For your security, only the last sent email is valid</h3>
				</>
			)}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<{
	isSuccessful: boolean;
	csrfToken: string;
}> = async (context) => {
	const { uuid, email } = context.query;
	if (typeof uuid !== "string" || typeof email !== "string")
		return {
			props: {
				isSuccessful: false,
				csrfToken: await updateCsrf(context),
			},
		};

	//NOTE: this is not for security, but for convenience - this is just sent to the client side so that they know if the link was wrong beforehand
	const isSuccessful = await verifyUUID(email, uuid, "passwordResetUUID");

	return {
		props: {
			isSuccessful,
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
