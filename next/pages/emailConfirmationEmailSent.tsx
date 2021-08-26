import { updateLoginState, useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ExtendedNextApiRequest } from "../server/types";
import { getSession } from "../server/auth/auth-cookie";
import React, { ReactElement, useState } from "react";
import { sendEmailConfirmationEmail } from "../server/email/emailConfirm";
import { isLoggedIn, isVerified } from "../server/auth/data";
import { useViewProtection } from "../client/utils/otherHooks";
import EditableField from "../client/components/EditableField";
import { Flattened } from "combined-validator";
import isEmail from "validator/lib/isEmail";
import { updateCsrf } from "../server/csrf";
import { csrfFetch } from "../client/utils/csrf";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { CircularProgress } from "@material-ui/core";
import { createEmailChangingFunction } from "./myAccount";

export default function EmailConfirmationEmailSent({
	email,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["unverified_org", "unverified_user", "org", "user"]);
	const viewerType = useViewerType();

	const emailFields: Flattened = {
		email: {
			required: true,
			type: "string",
		},
	};

	const [isLoading, setIsLoading] = useState(false);

	const [overallErrors, setOverallErrors] = useState(
		{} as { [key: string]: any }
	);

	const changeEmail = createEmailChangingFunction(
		overallErrors,
		setOverallErrors,
		setIsLoading,
		csrfToken
	);

	return (
		<div>
			<Head title="Verification email sent - cybervolunteers" />

			{Object.entries(overallErrors).map(([k, v]) => (
				<h1 key={k}>{v}</h1>
			))}

			{viewerType === "unverified_user" || viewerType === "unverified_org" ? (
				<>
					<h1>The verification email has been sent.</h1>
					<h2>Please check your email</h2>
					<EditableField
						editableFields={emailFields}
						name="email"
						perElementValidationCallbacks={{
							email: (v: string) => isEmail(v),
						}}
						presentableNames={{
							email: "Your email",
						}}
						sendEditRequest={changeEmail}
						value={email}
					></EditableField>
				</>
			) : (
				<>
					<h1>Your email has been verified already.</h1>
					<div>
						Feel free to tweak{" "}
						<Link href="/myAccount" passHref>
							<a>your account</a>
						</Link>{" "}
						or to{" "}
						<Link href="/searchListings" passHref>
							<a>look at some listings</a>
						</Link>
					</div>
				</>
				// TODO: add a button to resend = refresh
				// TODO: maybe you can refresh this page to update session cookies instead of logging in and out?
			)}
			{isLoading ? <CircularProgress /> : null}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<{
	email: string;
	csrfToken: string;
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	const email = session?.email; //TODO: replace the email
	if (typeof email === "string" && isLoggedIn(session) && !isVerified(session))
		sendEmailConfirmationEmail(email);

	return {
		props: {
			csrfToken: await updateCsrf(context),
			email,
		}, // will be passed to the page component as props
	};
};
