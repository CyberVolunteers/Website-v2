import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import { faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Head from "../client/components/Head";
import Link from "next/link";
import styles from "../client/styles/simplePage.module.css";
import { csrfFetch } from "../client/utils/csrf";
import { Button, TextField } from "@material-ui/core";
import { updateCsrf } from "../server/csrf";
import CustomForm from "../client/components/CustomForm";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { getUserType, manipulateDataByEmail } from "../server/auth/data";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import BackButton from "../client/components/BackButton";
import zxcvbn from "zxcvbn";
import PasswordStrengthBar from "../client/components/PasswordStrengthBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { destroyUUID, verifyUUID } from "../server/email/redis";
import { getMongo } from "../server/mongo";
import { incorrectUUIDError } from "../client/utils/const";
import { contactEmail } from "../serverAndClient/staticDetails";

export default function ChangePassword({
	csrfToken,
	firstName,
	lastName,
	email,
	uuid,
	isSuccessful,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	if (!isSuccessful)
		return (
			<>
				<Head title="Could not reset your password - cybervolunteers" />
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Something went wrong when resetting your password.
					</h1>
					<p className={styles.main_para}>
						It is possible that this is because the link you used is too old.
						Please try again.
					</p>

					<h4>For your security, only the last sent email is valid.</h4>
				</div>
			</>
		);
	else
		return (
			<MainPage
				{...{
					csrfToken,
					firstName,
					lastName,
					email,
					uuid,
					isSuccessful,
				}}
			/>
		);
}

function MainPage({
	csrfToken,
	firstName,
	lastName,
	email,
	uuid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);

	const isAfterRehydration = useIsAfterRehydration();

	const [newPassword, setNewPassword] = useState("");
	const [newPassword2, setNewPassword2] = useState("");

	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
	const [newPassword2ErrorMessage, setNewPassword2ErrorMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [passwordStrength, setPasswordStrength] = useState(0);

	function comparePasswords() {
		if (newPassword !== newPassword2)
			setNewPassword2ErrorMessage("The two passwords must be equal");
		else setNewPassword2ErrorMessage("");
	}

	const isAllCorrect =
		newPassword !== "" &&
		newPassword2 !== "" &&
		newPasswordErrorMessage === "" &&
		newPassword2ErrorMessage === "" &&
		newPassword === newPassword2;

	async function submit() {
		if (!isAllCorrect) return;
		const res = await csrfFetch(csrfToken, "/api/passwordResetFinal", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				email,
				uuid,
				password: newPassword,
			}),
		});

		const errorMessage = await res.text();

		if (errorMessage === incorrectUUIDError)
			return router.push("/forgotPasswordFinal?isSuccessful=false");
		if (res.status >= 400) return setErrorMessage(errorMessage);
		router.push("/forgotPasswordFinal?isSuccessful=true");
	}

	if (isAfterRehydration && firstName === null)
		return (
			<div>
				<Head title="Could not change password - cybervolunteers" />
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						We are sorry, we {"couldn't"} change your password
					</h1>
					<p className={styles.main_para}>
						Try again or contact us at {contactEmail}
					</p>
				</div>
			</div>
		);
	return (
		<div>
			<Head title="Change password - cybervolunteers" />
			<BackButton text="Password" onClick={() => router.back()} />
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
					subheadingText="Please enter a new, memorable password."
				>
					<TextField
						error={newPasswordErrorMessage !== ""}
						onBlur={() => {
							if (newPassword === "")
								setNewPasswordErrorMessage("Please enter a password");
							comparePasswords();
						}}
						onFocus={() => {
							setNewPasswordErrorMessage("");
							setNewPassword2ErrorMessage("");
						}}
						onChange={(e) => {
							setNewPassword(e.target.value);
						}}
						id="new-password"
						label="New Password"
						variant="outlined"
						style={{ width: "100%" }}
						type={showPassword ? "text" : "password"}
					/>
					<span className="helping-text password-helper">
						{newPasswordErrorMessage}
					</span>
					<PasswordStrengthBar
						password={newPassword}
						passwordStrength={passwordStrength}
						setPasswordStrength={setPasswordStrength}
					/>
					<TextField
						error={newPassword2ErrorMessage !== ""}
						onBlur={() => {
							if (newPassword2 === "")
								setNewPassword2ErrorMessage("Please enter a password");
							comparePasswords();
						}}
						onFocus={() => setNewPassword2ErrorMessage("")}
						onChange={(e) => {
							setNewPassword2(e.target.value);
						}}
						id="new-password2"
						label="Confirm New Password"
						variant="outlined"
						style={{ width: "100%" }}
						type={showPassword ? "text" : "password"}
					/>
					<span className="helping-text password-helper">
						{newPassword2ErrorMessage}
					</span>
					<span
						className="helping-text login-helper"
						style={{
							display: errorMessage === "" ? "none" : "inline-block",
						}}
					>
						{errorMessage}
					</span>

					<div
						className="checkbox-wrapper password-checkbox-wrapper"
						style={{ marginBottom: 20 }}
					>
						<input
							type="checkbox"
							name=""
							id="show-password-checkbox"
							style={{ display: "none" }}
							checked={showPassword}
							onChange={() => setShowPassword(!showPassword)}
						/>
						<label
							htmlFor="show-password-checkbox"
							id="forget-password-wrapper"
						>
							<label
								htmlFor="show-password-checkbox"
								className="custom-checkbox custom-checkbox-box show-password-label"
							>
								<FontAwesomeIcon className="white-fa-check" icon={faCheck} />
							</label>
							<p> Show password</p>
						</label>
					</div>

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
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	firstName: string;
	lastName: string;
	uuid: string;
	email: string;
	isSuccessful: boolean;
}> = async (context) => {
	const { uuid, email } = context.query;
	if (typeof uuid !== "string" || typeof email !== "string")
		return {
			props: {
				csrfToken: "",
				firstName: "",
				lastName: "",
				email: "",
				uuid: "",
				isSuccessful: false,
			},
		};

	let isSuccessful = await verifyUUID(email, uuid, "passwordResetUUID");
	if (!isSuccessful)
		return {
			props: {
				csrfToken: "",
				firstName: "",
				lastName: "",
				email,
				uuid,
				isSuccessful: false,
			},
		};

	// connect mongo
	//TODO: somehow make it impossible to miss this?
	await getMongo();

	const { firstName, lastName } = (await manipulateDataByEmail(email)) ?? {};
	if (typeof firstName !== "string" || typeof lastName !== "string")
		return {
			props: {
				csrfToken: "",
				firstName: "",
				lastName: "",
				email,
				uuid,
				isSuccessful: false,
			},
		};

	return {
		props: {
			csrfToken: await updateCsrf(context),
			firstName,
			lastName,
			email,
			uuid,
			isSuccessful: true,
		}, // will be passed to the page component as props
	};
};
