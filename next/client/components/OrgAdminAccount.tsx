import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	HandleEmailValidation,
	// HandlePasswordValidation,
	HandleTextValidation,
	HandleConfirmPasswordValidation,
} from "../js/ValidationSignUp";
import PasswordStrengthBar from "./PasswordStrengthBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import BasicUserSignup from "./BasicUserSignup";
import { CharitySignupTabType } from "../../pages/charitySignup";

export default function OrgAdminAccount({
	setRequestErrorMessage,
	submit,
	setData,
}: {
	setRequestErrorMessage: Dispatch<SetStateAction<string>>;
	submit: () => Promise<void>;
	setData: React.Dispatch<
		React.SetStateAction<{
			firstName: string;
			lastName: string;
			password: string;
			password2: string;
			email: string;
		}>
	>;
}) {
	const [isDataValid, setIsDataValid] = useState(false);

	return (
		<>
			<p className="create-account-message">Now Just Create an admin account</p>
			{/* Again, can not remove this because css would be broken otherwise */}
			<p className="welcom-message" style={{ display: "none" }}></p>
			<p className="helper">
				This will be used to login to and manage your Organisation
			</p>

			<div className="input-collection">
				<BasicUserSignup
					setIsDataValid={setIsDataValid}
					setData={setData}
					setRequestErrorMessage={setRequestErrorMessage}
				/>

				<div className="button-wrapper width_100_button">
					<Button
						variant="contained"
						color="primary"
						className={isDataValid ? "" : "disable"}
						onClick={() => {
							if (isDataValid) submit();
						}}
					>
						SIGN UP
					</Button>
				</div>
			</div>
		</>
	);
}
