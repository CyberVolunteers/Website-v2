import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import isEmail from "validator/lib/isEmail";
import { addVisitedField, getFieldClasses } from "../utils/formUtils";
import PasswordStrengthBar from "./PasswordStrengthBar";

export default function BasicUserSignup({
	setData,
	setIsDataValid,
	setRequestErrorMessage,
}: {
	setData: React.Dispatch<
		React.SetStateAction<{
			firstName: string;
			lastName: string;
			password: string;
			password2: string;
			email: string;
		}>
	>;
	setIsDataValid: React.Dispatch<React.SetStateAction<boolean>>;
	setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");

	const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
	const [secondNameErrorMessage, setSecondNameErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [password2ErrorMessage, setPassword2ErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([] as string[]);

	const [showPassword, setShowPassword] = useState(false);

	let [passwordStrength, setPasswordStrength] = useState(0);

	const allFields = { firstName, lastName, password, password2, email };
	const allFieldVals = Object.values(allFields);

	// check that the passwords match and that they are strong enough
	useEffect(() => {
		setPassword2ErrorMessage(
			password === password2 ? "" : "The two passwords do not match"
		);
	}, [password, password2]);

	// record the vals
	useEffect(() => {
		// TODO: maybe refs are better; also look at the second page
		setData(allFields);
		setIsDataValid(
			!allFieldVals.includes("") &&
				// also some exceptions for the unusual checks
				// can use error message for passwords because those are updated whenever the passwords change
				passwordErrorMessage === "" &&
				password2ErrorMessage === "" &&
				firstNameErrorMessage === "" &&
				secondNameErrorMessage === "" &&
				emailErrorMessage === "" &&
				isEmail(email)
		);
	}, [...allFieldVals, passwordErrorMessage, password2ErrorMessage, email]);
	return (
		<>
			<TextField
				className={`firstName ${getFieldClasses("firstName", visitedFields)}`}
				onBlur={(e) => {
					if (e.target.value === "")
						setFirstNameErrorMessage("Please enter a first name");
				}}
				onFocus={() => {
					addVisitedField("firstName", visitedFields, setVisitedFields);
					setFirstNameErrorMessage("");
				}}
				onChange={(e) => setFirstName(e.target.value)}
				value={firstName}
				id="fname"
				label="First name"
				autoComplete="on"
				variant="outlined"
				style={{ width: "100%" }}
				error={firstNameErrorMessage !== ""}
			/>
			<span
				className="helping-text"
				style={{
					marginBottom: firstNameErrorMessage === "" ? "10px" : "20px",
				}}
			>
				{firstNameErrorMessage}
			</span>

			<TextField
				className={`secondName ${getFieldClasses("secondName", visitedFields)}`}
				onBlur={(e) => {
					if (e.target.value === "")
						setSecondNameErrorMessage("Please enter a last name");
				}}
				onFocus={() => {
					addVisitedField("secondName", visitedFields, setVisitedFields);
					setSecondNameErrorMessage("");
				}}
				// onChange={HandleTextValidation}
				onChange={(e) => setLastName(e.target.value)}
				value={lastName}
				id="lname"
				label="Last name"
				variant="outlined"
				autoComplete="on"
				style={{ width: "100%" }}
				error={secondNameErrorMessage !== ""}
			/>
			<span
				className="helping-text"
				style={{
					marginBottom: secondNameErrorMessage === "" ? "10px" : "20px",
				}}
			>
				{secondNameErrorMessage}
			</span>

			<TextField
				className={`email ${getFieldClasses("email", visitedFields)}`}
				onBlur={(e) => {
					if (e.target.value === "")
						return setEmailErrorMessage("Please enter an email");
					if (!isEmail(email))
						return setEmailErrorMessage("Please enter a valid email");

					(async () => {
						const res = await fetch(
							`/api/isEmailFree?${new URLSearchParams({ email })}`,
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
							return setRequestErrorMessage(
								"Something went wrong when checking if the email is already used."
							);

						const isUsed = (await res.json()) !== true;

						if (isUsed)
							return setEmailErrorMessage("This email is already used");
					})();
				}}
				onFocus={() => {
					addVisitedField("email", visitedFields, setVisitedFields);
					setEmailErrorMessage("");
				}}
				// onChange={HandleEmailValidation}
				onChange={(e) => setEmail(e.target.value)}
				value={email}
				id="email"
				label="Email"
				autoComplete="on"
				variant="outlined"
				style={{ width: "100%" }}
				error={emailErrorMessage !== ""}
			/>
			<span
				className="helping-text email-helper"
				style={{
					marginBottom: emailErrorMessage === "" ? "10px" : "20px",
				}}
			>
				{emailErrorMessage}
			</span>

			<TextField
				className={`password ${getFieldClasses("password", visitedFields)}`}
				onBlur={(e) => {
					if (e.target.value === "")
						setPasswordErrorMessage("Please enter a password");
				}}
				// onChange={HandlePasswordValidation}
				onChange={(e) => setPassword(e.target.value)}
				id="password"
				label="Password"
				variant="outlined"
				style={{ width: "100%" }}
				type={showPassword ? "text" : "password"}
				error={passwordErrorMessage !== ""}
				onFocus={() => {
					addVisitedField("password", visitedFields, setVisitedFields);
					setPasswordErrorMessage("");
				}}
			/>

			<span
				className="helping-text password-helper"
				style={{
					marginBottom: passwordErrorMessage === "" ? "0px" : "20px",
					display: "inline-block",
				}}
			>
				{passwordErrorMessage}
			</span>

			<PasswordStrengthBar
				password={password}
				passwordStrength={passwordStrength}
				setPasswordStrength={setPasswordStrength}
			/>

			<TextField
				className={`password2 ${getFieldClasses("password2", visitedFields)}`}
				onChange={(e) => setPassword2(e.target.value)}
				id="ConfirmPassword"
				label="Confirm Password"
				variant="outlined"
				style={{ width: "100%" }}
				type={showPassword ? "text" : "password"}
				error={password2ErrorMessage !== ""}
				onFocus={() => {
					addVisitedField("password2", visitedFields, setVisitedFields);
					setPassword2ErrorMessage("");
				}}
			/>

			<span
				className="helping-text password-helper"
				style={{
					marginBottom: passwordErrorMessage === "" ? "10px" : "20px",
				}}
			>
				{password2ErrorMessage}
			</span>

			<span
				className="helping-text not-correct"
				style={{
					marginBottom: "10px",
					display: "none",
					paddingLeft: 0,
				}}
			>
				Email or password is not recognized
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
				<label htmlFor="show-password-checkbox" id="forget-password-wrapper">
					<label
						htmlFor="show-password-checkbox"
						className="custom-checkbox custom-checkbox-box show-password-label"
					>
						<FontAwesomeIcon className="white-fa-check" icon={faCheck} />
					</label>
					<p> Show password</p>
				</label>
			</div>
		</>
	);
}
