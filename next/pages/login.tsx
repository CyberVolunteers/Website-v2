import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { updateCsrf } from "../server/csrf";
import Head from "../client/components/Head";
import { csrfFetch } from "../client/utils/csrf";
import CustomForm from "../client/components/CustomForm";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { error } from "../client/utils/logger";
import {
	getAccountInfo,
	updateLoginState,
	useViewerType,
} from "../client/utils/userState";

export default function Login({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const userType = useViewerType();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const [loginErrorMessage, setLoginErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

	const showLoginRequirementMessage =
		router.query.showLoginRequirementMessage === "true";
	useEffect(() => {
		if (showLoginRequirementMessage) {
			const hasToBeVerified = router.query.hasToBeVerified === "true";

			const verificationType = hasToBeVerified ? "verified " : "";
			const targetUserType =
				router.query.hasToBeUser === "true"
					? `as a ${verificationType}user `
					: "";
			setLoginErrorMessage(
				`You need to be logged in ${targetUserType}to do that.`
			);
		}
	}, []);

	const isAllDataValid =
		email !== "" &&
		password !== "" &&
		emailErrorMessage === "" &&
		passwordErrorMessage === "";

	async function submit() {
		if (!isAllDataValid) return;
		const res = await csrfFetch(csrfToken, "/api/login", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		const errorText = await res.text();

		const firstDigit = ("" + res.status)[0];
		updateLoginState();
		if (res.status === 200) {
			// force unverified org warning
			if (userType === "unverified_org") {
				const data = getAccountInfo();

				if (data.isEmailVerified !== true)
					return router.push("/sendEmailConfirmationEmail");
				return router.push("/organisationVerificationNotification");
			}

			// the rest
			if (showLoginRequirementMessage) return router.back();

			if (userType === "unverified_user") return router.push("/myAccount");
			if (userType === "user") return router.push("/searchListings");
			if (userType === "org") return router.push("/manageListings");
		}
		error(
			"login",
			`failed with text "${errorText}", status: ${res.status}, statusText: ${res.statusText}`
		);
		if (firstDigit === "4") return setLoginErrorMessage(errorText);
		return setLoginErrorMessage(
			"Something went wrong. Please try again later."
		);
	}

	return (
		<div>
			<Head title="Sign in - cybervolunteers" />
			<div className="SignIn">
				<div className="body-area">
					<CustomForm
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
						headingLinkHref="/userSignup"
						headingText={
							<span>
								Sign in below <br />
								or
							</span>
						}
						headingLinkText="create a new account"
						subheadingText="Sign in to continue to your Cyber Volunteers account."
					>
						<div className="input-collection">
							<TextField
								error={emailErrorMessage !== ""}
								onBlur={() => {
									if (email === "")
										return setEmailErrorMessage("Please enter an email");
									if (!isEmail(email))
										return setEmailErrorMessage("Please enter a valid email");
								}}
								onFocus={generateErrorResetter(setEmailErrorMessage)}
								onChange={(e) => setEmail(e.target.value)}
								id="email"
								label="Email"
								variant="outlined"
								style={{ width: "100%" }}
							/>
							<span className="helping-text email-helper">
								{emailErrorMessage}
							</span>
							<div className="text-field">
								<div
									className="eye-wrap"
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
									onFocus={generateErrorResetter(setPasswordErrorMessage)}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
									id="password"
									label="Password"
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
										display: loginErrorMessage === "" ? "none" : "inline-block",
									}}
								>
									{loginErrorMessage}
								</span>
							</div>
							<div className="button-wrapper">
								<Link
									href={`/forgotPassword?possibleEmail=${encodeURIComponent(
										email
									)}`}
								>
									Forgotten my Password
								</Link>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									style={{ width: "100%" }}
									className={isAllDataValid ? "" : "disable"}
								>
									SIGN IN
								</Button>
							</div>
						</div>

						<div className="remember-me-wrapper">
							<div className="remember-me-wrapper">
								<input type="checkbox" name="" id="remember-me" />
								<div className="custom-checkbox-container">
									<label htmlFor="remember-me">Remember me</label>
									{/* TODO: make it actually do something */}
								</div>
							</div>
							<div className="question-mark-area">
								<svg
									data-v-3dd4fca4=""
									width="16"
									height="16"
									id="help-icon-remember-me"
									viewBox="0 0 28 28"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									className="help-icon"
									tabIndex={0}
									aria-expanded="false"
								>
									<path
										data-v-3dd4fca4=""
										strokeWidth="1"
										fillRule="evenodd"
										fill="#D8D8D8"
										d="M14,0 C6.2685,0 0,6.2685 0,14 C0,21.7315 6.2685,28 14,28
		C21.7315,28 28,21.7315 28,14 C28,6.2685 21.7315,0 14,0 Z M15.752,16.688 L15.752,16.04 C15.752,14.816
		17.264,14.216 18.392,13.088 C19.136,12.344 19.76,11.408 19.76,9.944 C19.76,7.52 17.96,5 14.096,5
		C10.376,5 8.528,7.352 8,10.352 L11.456,10.928 C11.624,9.392 12.368,7.76 14.096,7.76 C15.392,7.76
		16.208,8.696 16.208,9.824 C16.208,11 15.368,11.6 14.672,12.104 C13.472,12.968 12.248,14.12 12.248,15.872
		L12.248,16.688 L15.752,16.688 Z M11.984,21.312 C11.984,22.464 12.824,23.376 14.048,23.376 C15.272,23.376
		16.112,22.464 16.112,21.312 C16.112,20.088 15.272,19.272 14.048,19.272 C12.824,19.272 11.984,20.088
		11.984,21.312 L11.984,21.312 Z"
									></path>
								</svg>
								<div className="question-mark-answer">
									<p>
										Staying signed in enables personalized browsing and seamless
										lending. You may be asked again for your password to view
										account information or make withdrawals, but uncheck this
										option if you’re using a public device.
									</p>
									<div className="arrow"></div>
								</div>
							</div>
						</div>
					</CustomForm>
				</div>
			</div>
		</div>
	);
}

function generateErrorResetter(
	setter: React.Dispatch<React.SetStateAction<string>>
) {
	return () => setter("");
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
