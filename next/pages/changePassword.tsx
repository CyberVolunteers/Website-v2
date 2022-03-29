import {
	FieldConstraintsCollection,
	flatten,
	Flattened,
} from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect } from "react";
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
import { getUserType } from "../server/auth/data";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import BackButton from "../client/components/BackButton";
import zxcvbn from "zxcvbn";
import PasswordStrengthBar from "../client/components/PasswordStrengthBar";

export default function ChangePassword({
	csrfToken,
	firstName,
	lastName,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	// TODO: fix view protections
	// useViewProtection(["org", "user", "unverified_org", "unverified_user"]);

	const router = useRouter();
	const isAfterRehydration = useIsAfterRehydration();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPassword2, setNewPassword2] = useState("");

	const [showCurrentPassword, setCurrentShowPassword] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");
	const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] =
		useState("");
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
	const [newPassword2ErrorMessage, setNewPassword2ErrorMessage] = useState("");

	const [passwordStrength, setPasswordStrength] = useState(0);

	function comparePasswords() {
		if (newPassword !== newPassword2)
			setNewPassword2ErrorMessage("The two passwords must be equal");
		else setNewPassword2ErrorMessage("");
	}

	const isAllCorrect =
		newPassword !== "" &&
		newPassword2 !== "" &&
		currentPassword !== "" &&
		newPasswordErrorMessage === "" &&
		newPassword2ErrorMessage === "" &&
		currentPasswordErrorMessage === "" &&
		newPassword === newPassword2;

	async function submit() {
		if (!isAllCorrect) return;
		const res = await csrfFetch(csrfToken, "/api/changePassword", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				oldPassword: currentPassword,
				newPassword,
			}),
		});

		if (res.status >= 400) return setErrorMessage(await res.text());
		else router.push("/myAccount");
	}

	if (isAfterRehydration && firstName === null) router.push("/login");
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
					subheadingText="Please first verify it is you by entering your current password and then enter your new password."
				>
					<div className={styles.text_field}>
						<div
							className={styles.eye_wrap}
							onClick={() => setCurrentShowPassword(!showCurrentPassword)}
						>
							<FontAwesomeIcon
								icon={showCurrentPassword ? faEyeSlash : faEye}
							/>
						</div>

						<TextField
							error={currentPasswordErrorMessage !== ""}
							onBlur={() => {
								if (currentPassword === "")
									setCurrentPasswordErrorMessage("Please enter a password");
							}}
							onFocus={() => setCurrentPasswordErrorMessage("")}
							onChange={(e) => {
								setCurrentPassword(e.target.value);
							}}
							id="current-password"
							label="Current Password"
							variant="outlined"
							style={{ width: "100%" }}
							type={showCurrentPassword ? "text" : "password"}
						/>

						<span className="helping-text password-helper">
							{currentPasswordErrorMessage}
						</span>
					</div>
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
						type="password"
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
						type="password"
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
	// instruct the page to redirect us to login
	if (typeof session !== "object" || session === null)
		return {
			props: {
				firstName: null,
				lastName: "",
				csrfToken: await updateCsrf(context),
			},
		};
	const { isUser, isVerifiedUser } = getUserType(session);
	// instruct the page to redirect us to login
	if (!isVerifiedUser)
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
