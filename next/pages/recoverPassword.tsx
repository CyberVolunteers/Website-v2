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
import { RedirectWithErrorMessage } from "../serverAndClient/utils";

export default function ChangePassword({
	csrfToken,
	firstName,
	lastName,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const isAfterRehydration = useIsAfterRehydration();

	const [showPassword, setShowPassword] = useState(false);

	const [newPassword, setNewPassword] = useState("");
	const [newPassword2, setNewPassword2] = useState("");

	const [errorMessage, setErrorMessage] = useState("");
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
	const [newPassword2ErrorMessage, setNewPassword2ErrorMessage] = useState("");

	const [passwordStrength, setPasswordStrength] = useState(0);

	// NOTE: if we are not allowed to access this page, we are redirected to login
	if (firstName === null)
		return <RedirectWithErrorMessage hasToBeVerified hasToBeUser />;
	return (
		<div>
			<Head title="Change password - cybervolunteers" />
			<BackButton text="Password" onClick={() => router.back()} />
			<div className="body-area">
				<CustomForm
					onSubmit={(e) => {
						e.preventDefault();
					}}
					headingText={
						<span>
							Hi, {firstName} {lastName}
						</span>
					}
					subheadingText="Please enter a memorable new password."
				>
					<TextField
						error={newPasswordErrorMessage !== ""}
						onBlur={() => {
							if (newPassword === "")
								setNewPasswordErrorMessage("Please enter a password");
						}}
						onFocus={() => setNewPasswordErrorMessage("")}
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

					<span style={{ margin: "0.5rem", display: "inline-block" }}>
						<input
							type="checkbox"
							onChange={() => setShowPassword(!showPassword)}
						/>
						<span style={{ paddingLeft: "0.5rem" }}>Show password </span>
					</span>

					<div className="button-wrapper wide-button" style={{ width: "100%" }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							style={{ width: "100% !important" }}
							className={
								newPassword === "" ||
								newPassword2 === "" ||
								newPasswordErrorMessage !== "" ||
								newPassword2ErrorMessage !== "" ||
								newPassword !== newPassword2
									? "disable"
									: ""
							}
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
	const { isUser, isVerifiedUser } = getUserType(session);
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
