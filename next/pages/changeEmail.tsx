import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Head from "../client/components/Head";
import Link from "next/link";
import styles from "../client/styles/simplePage.module.css";
import { csrfFetch } from "../client/utils/csrf";
import { Button, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateCsrf } from "../server/csrf";
import CustomForm from "../client/components/CustomForm";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { getUserType, isLoggedIn } from "../server/auth/data";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import BackButton from "../client/components/BackButton";
import { RedirectWithErrorMessage } from "../serverAndClient/utils";

export default function ChangeEmail({
	csrfToken,
	firstName,
	lastName,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const isAfterRehydration = useIsAfterRehydration();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

	const isAllCorrect =
		email !== "" &&
		emailErrorMessage === "" &&
		password !== "" &&
		passwordErrorMessage === "";

	async function submit() {
		if (!isAllCorrect) return;
		const res = await csrfFetch(csrfToken, "/api/changeEmail", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				password,
				email,
			}),
		});

		if (res.status >= 400) return setErrorMessage(await res.text());
		else router.push("/myAccount");
	}

	if (firstName === null) return <RedirectWithErrorMessage />;
	return (
		<div>
			<Head title="Change email - cybervolunteers" />
			<BackButton text="Email" onClick={() => router.back()} />
			<div className="body-area">
				<CustomForm
					onSubmit={(e) => {
						e.preventDefault();
						submit();
					}}
					headingText={
						<span>
							Hi, {firstName} {lastName}
						</span>
					}
					subheadingText="Enter your new email and your current password. Once you have entered your email address you will receive a verification email."
				>
					<TextField
						error={emailErrorMessage !== ""}
						onBlur={() => {
							if (email === "") setEmailErrorMessage("Please enter an email");
						}}
						onFocus={() => setEmailErrorMessage("")}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						id="email"
						label="New Email"
						variant="outlined"
						style={{ width: "100%" }}
					/>

					<span className="helping-text email-helper">{emailErrorMessage}</span>
					<div className={styles.text_field}>
						<div
							className={styles.eye_wrap}
							onClick={() => setShowPassword(!showPassword)}
						>
							<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
						</div>

						<TextField
							error={passwordErrorMessage !== ""}
							onBlur={() => {
								if (password === "")
									setPasswordErrorMessage("Please enter a password");
							}}
							onFocus={() => setPasswordErrorMessage("")}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							id="password"
							label="Current Password"
							variant="outlined"
							style={{ width: "100%" }}
							type={showPassword ? "text" : "password"}
						/>

						<span className="helping-text password-helper">
							{passwordErrorMessage}
						</span>

						<span
							className="helping-text login-helper"
							style={{
								display: errorMessage === "" ? "none" : "inline-block",
							}}
						>
							{errorMessage}
						</span>
					</div>
					<div className="button-wrapper">
						<Link href="/forgotPassword">Forgotten my Password</Link>
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
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	firstName: null | string;
	lastName: string;
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	if (typeof session !== "object" || session === null)
		return {
			props: {
				firstName: null,
				lastName: "",
				csrfToken: await updateCsrf(context),
			},
		};
	if (!isLoggedIn(session))
		return {
			props: {
				firstName: null,
				lastName: "",
				csrfToken: await updateCsrf(context),
			},
		};

	return {
		props: {
			csrfToken: await updateCsrf(context),
			firstName: session.firstName,
			lastName: session.lastName,
		}, // will be passed to the page component as props
	};
};
