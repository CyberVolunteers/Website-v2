import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { updateCsrf } from "../server/csrf";

import styles from "../client/styles/simplePage.module.css";

import Head from "../client/components/Head";
import BackButton from "../client/components/BackButton";
import { Button, TextField } from "@material-ui/core";
import CustomButton from "../client/components/Button";
import CustomForm from "../client/components/CustomForm";
import { createSessionOutOfData, getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { getUserType, manipulateDataByEmail } from "../server/auth/data";
import { sendPasswordResetEmail } from "../server/email";
import { logger } from "../server/logger";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import { useState } from "react";

export default function ForgotPassword({
	csrfToken,
	email,
	isErrorBecauseUnverified,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	const isAfterRehydration = useIsAfterRehydration();

	if (!isAfterRehydration)
		<>
			<Head title="Forgotten password - cybervolunteers" />
		</>;

	async function submit() {
		const res = await fetch(
			`/api/isEmailFree?${new URLSearchParams({ email: enteredEmail })}`,
			{
				method: "GET",
				credentials: "same-origin", // only send cookies for same-origin requests
				headers: {
					"content-type": "application/json",
					accept: "application/json",
				},
			}
		);

		// TODO: proper logging in this and similar situations

		if (res.status >= 400)
			return setErrorMessage(
				"Something went wrong when checking if the email exists"
			);

		const isUsed = (await res.json()) !== true;

		if (!isUsed)
			return setEmailErrorMessage(
				"This email was not recognized. Could you please double-check that it is correct?"
			);

		router.push(`/forgotPassword?email=${encodeURIComponent(enteredEmail)}`);
	}

	const [enteredEmail, setEnteredEmail] = useState(
		typeof router.query.possibleEmail === "string"
			? router.query.possibleEmail
			: ""
	);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const isAllCorrect =
		enteredEmail !== "" && emailErrorMessage === "" && errorMessage === "";

	if (isErrorBecauseUnverified === true)
		return (
			<div>
				<Head title="Can not reset your password - cybervolunteers" />

				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Unfortunately, we can not reset your password due to security
						concerns.
					</h1>
					<p className={styles.main_para}>
						That is because the email address {email} has not been verified.
						Please try verifying it first.
					</p>
					<CustomButton
						href={`/sendEmailConfirmationEmail?email=${email}`}
						style={{ width: 220 }}
					>
						RESEND VERIFICATION EMAIL
					</CustomButton>
				</div>
			</div>
		);
	if (email === null)
		return (
			<div className="body-area">
				<Head title="Forgotten password - cybervolunteers" />

				<CustomForm
					onSubmit={(e) => {
						e.preventDefault();
						submit();
					}}
					headingText={<span>Resetting your password</span>}
					subheadingText="Please enter your email first so that we can reset your password."
				>
					<TextField
						error={emailErrorMessage !== ""}
						onBlur={() => {
							if (email === "") setEmailErrorMessage("Please enter an email");
						}}
						onFocus={() => {
							setEmailErrorMessage("");
							setErrorMessage("");
						}}
						onChange={(e) => {
							setEnteredEmail(e.target.value);
						}}
						id="email"
						label="Email"
						variant="outlined"
						style={{ width: "100%" }}
						type="email"
						value={enteredEmail}
					/>

					<span className="helping-text email-helper">{emailErrorMessage}</span>

					<span
						className="helping-text login-helper"
						style={{
							display: errorMessage === "" ? "none" : "inline-block",
						}}
					>
						{errorMessage}
					</span>
					<div className="button-wrapper">
						<Button
							type="submit"
							variant="contained"
							color="primary"
							style={{ width: "100%" }}
							className={isAllCorrect ? "" : "disable"}
						>
							NEXT
						</Button>
					</div>
				</CustomForm>
			</div>
		);

	return (
		<div>
			<Head title="Forgotten password - cybervolunteers" />
			<BackButton text="Password" onClick={() => router.back()} />
			<div className="body-area">
				<CustomForm
					onSubmit={(e) => {
						e.preventDefault();
					}}
					headingText={<span>Forgotten Password</span>}
					subheadingText={`A password reset email has been sent to ${email}. Please follow the instructions in the email to reset your password. `}
				>
					<div style={{ width: "100%", textAlign: "center" }}>
						Didn’t receive an email? We can send you{" "}
						<button
							onClick={() => router.reload()}
							type="submit"
							style={{
								color: "#f85220",
								cursor: "pointer",
								border: "none",
								backgroundColor: "inherit",
							}}
						>
							a new one.
						</button>
					</div>
				</CustomForm>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	isErrorBecauseUnverified?: true;
	email: string | null;
}> = async (context) => {
	let session = await getSession(context.req as ExtendedNextApiRequest);
	if (session === null && typeof context.query.email === "string")
		session = createSessionOutOfData(
			await manipulateDataByEmail(context.query.email)
		);

	if (typeof session !== "object" || session === null)
		return {
			props: {
				email: null,
				csrfToken: await updateCsrf(context),
			},
		};
	const { isUser, isVerifiedUser } = getUserType(session);
	if (!isVerifiedUser)
		return {
			props: {
				email: session.email,
				isErrorBecauseUnverified: true,
				csrfToken: await updateCsrf(context),
			},
		};

	logger.info("client.forgotPassword: request for %s", session.email);

	await sendPasswordResetEmail(session.email);

	return {
		props: {
			email: session.email,
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
