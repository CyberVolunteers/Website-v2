import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { updateCsrf } from "../server/csrf";
import Head from "../client/components/Head";

import Link from "next/link";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CustomForm from "../client/components/CustomForm";
import CustomButton from "../client/components/Button";

import zxcvbn from "zxcvbn";
import isEmail from "validator/lib/isEmail";
import { months } from "../client/utils/const";

const postcodeRegex =
	/^[a-zA-Z]{1,2}([0-9]{1,2}|[0-9][a-zA-Z])\s*[0-9][a-zA-Z]{2}$/;

export default function UserSignup(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement {
	const [firstPageData, setFirstPageData] = useState(
		{} as {
			firstName: string;
			lastName: string;
			password: string;
			password2: string;
			email: string;
		}
	);
	const [secondPageData, setSecondPageData] = useState(
		{} as {
			addressLine1: string;
			addressLine2: string;
			postcode: string;
			month: string;
			city: string;
			day: string;
			year: string;
			hasUserAcceptedPolicies: boolean;
		}
	);
	const [isFirstPageDataValid, setIsFirstPageDataValid] = useState(false);
	const [isSecondPageDataValid, setIsSecondPageDataValid] = useState(false);

	const [pageNum, setPageNum] = useState(0);

	function handleMovingToNextPage() {
		if (!isFirstPageDataValid) return;
		pageNum === 0 ? setPageNum(1) : null; //TODO: submit, maybe this https://ideal-postcodes.co.uk/autocomplete
		// or https://www.addressify.co.uk/
	}

	return (
		<>
			<Head title="Volunteer sign up - cybervolunteers" />
			<div className=" SignUp">
				<div className="body-area">
					<CustomForm
						headingText={
							pageNum === 0 ? (
								<span>
									Create a new account below <br /> or
								</span>
							) : (
								<span>
									{firstPageData.firstName}, welcome to Cyber Volunteers
								</span>
							)
						}
						headingLinkText="Sign in"
						headingLinkHref="/login"
						subheadingText={"Create a new Cyber Volunteers account."}
						onSubmit={(e) => {
							e.preventDefault();
							handleMovingToNextPage();
						}}
					>
						{pageNum === 0 ? (
							<FirstPage
								{...{
									firstPageData,
									setFirstPageData,
									isFirstPageDataValid,
									setIsFirstPageDataValid,
									handleMovingToNextPage,
								}}
							/>
						) : (
							<SecondPage
								{...{
									isSecondPageDataValid,
									setSecondPageData,
									setIsSecondPageDataValid,
								}}
							/>
						)}
					</CustomForm>
				</div>
			</div>
		</>
	);
}

function AddressMenu({
	setIsSimpleAddressInputShown,
	setPostcode,
	setAddressLine1,
	setCity,
}: {
	setIsSimpleAddressInputShown: React.Dispatch<React.SetStateAction<boolean>>;
	setPostcode: React.Dispatch<React.SetStateAction<string>>;
	setAddressLine1: React.Dispatch<React.SetStateAction<string>>;
	setCity: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [addressStageNum, setAddressStageNum] = useState(0);

	// the "raw" address is the address that is then used for suggestions
	const [rawAddress, setRawAddress] = useState("");
	const [visitedFields, setVisitedFields] = useState([] as string[]);

	// TODO: fetch results: create a server-side api, fetch the actual api from there and then double-check the postcode on submit. store as postcode + address in db + cache - no transitive deps please
	let [addressSuggestions, setAddressSuggestions] = useState(
		[] as (
			| { postcode: string; city: string; address: string }
			| { postcode: string; city: string; address: string[]; shortDesc: string }
		)[]
	);

	function updateAddressSuggestions() {
		if (addressStageNum !== 0) return;
		setAddressSuggestions(
			rawAddress.length === 0
				? []
				: [
						{
							postcode: "AB1 1CD",
							address: "1 Boogeyman cave str, East Sussex, UK",
							city: "Cavetown",
						},
						{
							postcode: "AB1 2CD",
							shortDesc: "Placeholder str, East Sussex, UK",
							city: "London",
							address: [
								"1 Placeholder str, East Sussex, UK",
								"2 Placeholder str, East Sussex, UK",
								"3 Placeholder str, East Sussex, UK",
								"4 Placeholder str, East Sussex, UK",
								"5 Placeholder str, East Sussex, UK",
								"6 Placeholder str, East Sussex, UK",
								"7 Placeholder str, East Sussex, UK",
								"8 Placeholder str, East Sussex, UK",
								"9 Placeholder str, East Sussex, UK",
								"10 Placeholder str, East Sussex, UK",
								"11 Placeholder str, East Sussex, UK",
							],
						},
				  ]
		);
	}

	const showAddressSuggestions = rawAddress.length > 0;
	const [isInFocus, setIsInFocus] = useState(false);

	useEffect(() => {
		updateAddressSuggestions();
	}, [rawAddress]);

	// ref to see if the element is clicked
	const thisRef = useRef<HTMLDivElement>(null);

	function onClickOutside(e: MouseEvent) {
		if (!thisRef.current) return;
		setIsInFocus(thisRef.current.contains(e.target as Node));
	}

	// wait for clicks outside
	useEffect(() => {
		document.addEventListener("click", onClickOutside, true);
		return () => {
			document.removeEventListener("click", onClickOutside, true);
		};
	}, []);

	const showRawAddressError =
		visitedFields.includes("rawAddress") && !isInFocus && rawAddress === "";

	return (
		<div ref={thisRef}>
			<div
				// autoComplete="off"
				style={{
					position: "relative",
					backgroundColor: "transparent",
					width: "100%",
					border: "none",
					padding: 0,
				}}
				className="address-wrapper"
			>
				<TextField
					className={`address ${
						isInFocus ? "expanded-address-input-field" : ""
					} ${getFieldClasses("rawAddress", visitedFields)}`}
					id="address"
					autoComplete="off"
					label="Enter your postcode"
					variant="outlined"
					style={{ width: "100%", marginTop: 20 }}
					type="text"
					value={rawAddress}
					error={showRawAddressError}
					// not onFocus to avoid flashes of the error message
					onBlur={() => {
						addVisitedField("rawAddress", visitedFields, setVisitedFields);
					}}
					onChange={(e) => {
						// invalidate the current option
						setAddressStageNum(0);
						setAddressSuggestions([]);
						setRawAddress(e.target.value);
					}}
				/>
				{showRawAddressError ? (
					<small
						style={{
							display: "block",
							marginTop: "7px",
							fontSize: "13px",
							color: "rgb(246, 91, 78)",
						}}
						className="address-error"
					>
						Invalid Address
					</small>
				) : null}
				{isInFocus ? null : (
					<small
						style={{
							fontSize: "12px",
							color: " rgb(127, 122, 123)",
							width: "100%",
							left: "0%",
						}}
						className="available-message"
					>
						Cyber Volunteers is only available in the UK
					</small>
				)}
			</div>

			{!isInFocus ? null : (
				<div
					data-worthless-attr="a"
					className="result-wrapper"
					style={{
						position: "relative",
						zIndex: 2,
						backgroundColor: "#fff",
					}}
				>
					{!showAddressSuggestions ? (
						<p>e.g. “SW12 7EU” or “64 London Road”</p>
					) : (
						<div className="typing-start-result">
							<div className="firstpart">
								{addressSuggestions.map((suggestion, i) => (
									<div
										className="row"
										key={i}
										onMouseDown={() => {
											// if a collection, enter the second stage
											if (Array.isArray(suggestion.address)) {
												// set the next stage
												setAddressStageNum(addressStageNum + 1);
												// expand
												const oldSuggestions = suggestion as {
													postcode: string;
													address: string[];
													city: string;
													shortDesc: string;
												};
												const newSuggestions = oldSuggestions.address.map(
													(a) => ({
														postcode: oldSuggestions.postcode,
														address: a,
														city: oldSuggestions.city,
													})
												);
												setAddressSuggestions(newSuggestions);
											} else {
												// select that option
												setAddressLine1(suggestion.address);
												setPostcode(suggestion.postcode);

												setCity(suggestion.city);

												// close that popup
												setIsSimpleAddressInputShown(false);
											}
										}}
									>
										<div className="left-presentation">
											<h5>
												{"shortDesc" in suggestion
													? suggestion.shortDesc
													: suggestion.address}
											</h5>
											<small>{suggestion.postcode}</small>
										</div>
										{Array.isArray(suggestion.address) ? (
											<p>{suggestion.address.length} results</p>
										) : null}
									</div>
								))}

								<span
									className="manual-address"
									style={{
										display: "block",
										color: "#F85220",
										fontSize: "15px",
										textAlign: "center",
										borderTop: "1px solid #ddd",
										padding: "10px 0px",
										cursor: "pointer",
									}}
									// Because onClick does not fire for a couple milliseconds and the element gets deleted
									onMouseDown={() => setIsSimpleAddressInputShown(true)}
								>
									{/*
															// onClick={(e) => {
															// 	e.preventDefault();

															// 	document.querySelector(
															// 		".address-wrapper"
															// 	).style.display = "none";
															// 	document.querySelector(
															// 		".result-wrapper"
															// 	).style.display = "none";
															// 	document
															// 		.querySelector(".expand-address")
															// 		.classList.add("active");
															// 	document.querySelector(
															// 		".country-select"
															// 	).style.marginTop = "-16px";
															// }}
														>
														 */}
									Enter address manually
								</span>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function FirstPage({
	handleMovingToNextPage,
	firstPageData,
	setFirstPageData,
	setIsFirstPageDataValid,
	isFirstPageDataValid,
}: {
	handleMovingToNextPage: () => void;
	setFirstPageData: React.Dispatch<
		React.SetStateAction<{
			firstName: string;
			lastName: string;
			password: string;
			password2: string;
			email: string;
		}>
	>;
	firstPageData: {
		firstName: string;
		lastName: string;
		password: string;
		password2: string;
		email: string;
	};
	setIsFirstPageDataValid: React.Dispatch<React.SetStateAction<boolean>>;
	isFirstPageDataValid: boolean;
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
	let [password2ErrorMessage, setPassword2ErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([] as string[]);

	const [passwordStrengthNotes, setPasswordStrengthNotes] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	let [passwordStrength, setPasswordStrength] = useState(0);

	const allFields = { firstName, lastName, password, password2, email };
	const allFieldVals = Object.values(allFields);

	// check that the passwords match and that they are strong enough
	useEffect(() => {
		// update the value now so that the following checks have the correct value
		password2ErrorMessage =
			password === password2 ? "" : "The two passwords do not match";
		setPassword2ErrorMessage(password2ErrorMessage);

		// also update the strength value right now
		if (password === "") {
			passwordStrength = 0;
			setPasswordStrengthNotes("");
		} else {
			const result = zxcvbn(password);
			const score = result.score;
			const passwordStrengthSummary = [
				"A very weak password",
				"A weak password",
				"A medium password",
				"A strong password",
				"A very strong password",
			][score];
			// because the score bar goes from 1 to 4 inclusive
			passwordStrength = Math.min(score + 1, 4);

			setPasswordStrengthNotes(passwordStrengthSummary);
		}
		setPasswordStrength(passwordStrength);
	}, [password, password2]);

	// record the vals
	useEffect(() => {
		// TODO: maybe refs are better; also look at the second page
		setFirstPageData(allFields);
		setIsFirstPageDataValid(
			!allFieldVals.includes("") &&
				// also some exceptions for the unusual checks
				// can use error message for passwords because those are updated whenever the passwords change
				passwordErrorMessage === "" &&
				password2ErrorMessage === "" &&
				isEmail(email)
		);
	}, allFieldVals);

	return (
		<>
			<div className="input-collection">
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
					className={`secondName ${getFieldClasses(
						"secondName",
						visitedFields
					)}`}
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
					}}
					onFocus={() => {
						addVisitedField("email", visitedFields, setVisitedFields);
						setEmailErrorMessage("");
					}}
					// onChange={HandleEmailValidation}
					onChange={(e) => setEmail(e.target.value)}
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

				{passwordStrengthNotes === "" && passwordStrength === 0 ? null : (
					<div className="password-ui-strong" style={{ marginTop: 10 }}>
						<div className="bars" style={{ marginBottom: 5 }}>
							{[1, 2, 3, 4].map((barIdNumber) => (
								<span
									key={barIdNumber}
									className={`bar ${
										passwordStrength < barIdNumber
											? ""
											: `password-strength-bar-level-${passwordStrength}`
									}`}
									id={`bar-${barIdNumber}`}
								></span>
							))}
						</div>

						<p
							style={{ fontSize: 12, marginTop: 10 }}
							className="passwordStrength"
						>
							Password Strength: {passwordStrengthNotes}
						</p>
					</div>
				)}

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

				<div className="button-wrapper">
					<Link
						href="/login"
						// style={{ color: "#F85220" }}
					>
						Sign in instead
					</Link>
					<Button
						variant="contained"
						color="primary"
						style={{ width: "100%" }}
						className={isFirstPageDataValid ? "" : "disable"}
						onClick={handleMovingToNextPage}
						type="submit"
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
}

function SecondPage({
	isSecondPageDataValid,
	setSecondPageData,
	setIsSecondPageDataValid,
}: {
	isSecondPageDataValid: boolean;
	setIsSecondPageDataValid: React.Dispatch<React.SetStateAction<boolean>>;
	setSecondPageData: React.Dispatch<
		React.SetStateAction<{
			addressLine1: string;
			addressLine2: string;
			postcode: string;
			month: string;
			city: string;
			day: string;
			year: string;
			hasUserAcceptedPolicies: boolean;
		}>
	>;
}) {
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [postcode, setPostcode] = useState("");
	const [month, setMonth] = useState("");
	const [city, setCity] = useState("");
	const [day, setDay] = useState("");
	const [year, setYear] = useState("");

	const [addressLine1ErrorMessage, setAddressLine1ErrorMessage] = useState("");
	const [postcodeErrorMessage, setPostcodeErrorMessage] = useState("");
	const [cityErrorMessage, setCityErrorMessage] = useState("");
	const [dayErrorMessage, setDayErrorMessage] = useState("");
	const [yearErrorMessage, setYearErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([] as string[]);

	const [isSimpleAddressInputShown, setIsSimpleAddressInputShown] =
		useState(true);

	const [hasUserAcceptedPolicies, setHasUserAcceptedPolicies] = useState(false);

	const allFields = {
		addressLine1,
		addressLine2,
		postcode,
		month,
		city,
		day,
		year,
		hasUserAcceptedPolicies,
	};
	const allFieldVals = Object.values(allFields);

	useEffect(() => {
		setSecondPageData(allFields);
		setIsSecondPageDataValid(
			Object.entries(allFields).every(
				([k, v]) => k === "addressLine2" || v !== ""
			) &&
				hasUserAcceptedPolicies &&
				dayErrorMessage === "" &&
				yearErrorMessage === "" &&
				postcodeRegex.test(postcode)
		);
	}, allFieldVals);

	function checkDay() {
		if (!visitedFields.includes("day")) return;
		const parsedDay = parseInt(day);
		if (day === "" || parsedDay > 31 || parsedDay === 0)
			setDayErrorMessage("Please enter a valid day");
		else setDayErrorMessage("");
	}

	function checkYear() {
		if (!visitedFields.includes("year")) return;
		const parsedYear = parseInt(year);

		if (
			year === "" ||
			parsedYear > new Date().getFullYear() ||
			parsedYear < 1900
		)
			setYearErrorMessage("Please enter a valid year");
		else setYearErrorMessage("");
	}

	useEffect(checkDay, [day]);
	useEffect(checkYear, [year]);

	return (
		<>
			<div className="full-address-container">
				{isSimpleAddressInputShown ? (
					<>
						<AddressMenu
							{...{
								setAddressLine1,
								setPostcode,
								setIsSimpleAddressInputShown,
								setCity,
							}}
						/>
						<div
							className="layout"
							style={{
								height: "15px",
							}}
						></div>
					</>
				) : (
					<>
						<div className="expand-address" style={{ marginTop: 20 }}>
							<div className="text-field-wrapper">
								<TextField
									className={`address ${getFieldClasses(
										"addressLine1",
										visitedFields
									)}`}
									id="address1"
									// onBlur={CheckIsValid}
									// onFocus={RemoveMessages}
									label="Address Line 1"
									variant="outlined"
									style={{ width: "100%" }}
									type="text"
									value={addressLine1}
									error={addressLine1ErrorMessage !== ""}
									onChange={(e) => setAddressLine1(e.target.value)}
									onBlur={(e) => {
										addVisitedField(
											"addressLine1",
											visitedFields,
											setVisitedFields
										);
										if (e.target.value === "")
											setAddressLine1ErrorMessage("Please enter an address");
									}}
									onFocus={generateErrorResetter(setAddressLine1ErrorMessage)}
								/>
								<span className="helping-text address-line-1">
									{addressLine1ErrorMessage}
								</span>
							</div>

							<div className="text-field-wrapper">
								<TextField
									// onBlur={CheckIsValid}
									// onFocus={RemoveMessages}
									className={`address ${getFieldClasses(
										"addressLine2",
										visitedFields
									)}`}
									id="address2"
									// onChange={HandleSecondStepText}
									label="Address Line 2 (optional)"
									variant="outlined"
									style={{ width: "100%" }}
									type="text"
									value={addressLine2}
									onChange={(e) => setAddressLine2(e.target.value)}
									onBlur={(e) => {
										addVisitedField(
											"addressLine2",
											visitedFields,
											setVisitedFields
										);
									}}
								/>
							</div>

							<span className="helping-text layout"></span>
							<div className="postcode-city-container">
								<div className="text-field-wrapper half-width">
									<TextField
										// onBlur={CheckIsValid}
										// onFocus={RemoveMessages}
										className={`postcode ${getFieldClasses(
											"postcode",
											visitedFields
										)}`}
										id="postcode"
										// onChange={HandleSecondStepText}
										label="Postcode"
										variant="outlined"
										type="text"
										value={postcode}
										error={postcodeErrorMessage !== ""}
										onChange={(e) => setPostcode(e.target.value)}
										onBlur={(e) => {
											addVisitedField(
												"postcode",
												visitedFields,
												setVisitedFields
											);
											if (!postcodeRegex.test(e.target.value))
												setPostcodeErrorMessage(
													"Please enter a valid postcode"
												);
										}}
										onFocus={generateErrorResetter(setPostcodeErrorMessage)}
									/>
									<div className="helping-text postcode-helper">
										{postcodeErrorMessage}
									</div>
								</div>
								<div className="text-field-wrapper half-width">
									<TextField
										// onBlur={CheckIsValid}
										// onFocus={RemoveMessages}
										className={`town ${getFieldClasses("town", visitedFields)}`}
										id="town"
										value={city}
										onChange={(e) => setCity(e.target.value)}
										error={cityErrorMessage !== ""}
										// onChange={HandleSecondStepText}
										label="Town/City"
										variant="outlined"
										type="text"
										onBlur={(e) => {
											addVisitedField("town", visitedFields, setVisitedFields);
											if (e.target.value === "")
												setCityErrorMessage("Please enter a town/city");
										}}
										onFocus={generateErrorResetter(setCityErrorMessage)}
									/>
									<div className="helping-text postcode-helper">
										{cityErrorMessage}
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			{/* <div className="country-select select-box">
									<FormControl className="dropdown-form-control">
										<InputLabel
											htmlFor="age-native-simple"
											style={{ pointerEvents: "none" }}
										>
											Country/Region
										</InputLabel>
										<Select
											native
											// onChange={HandleSecondStepText}
											id="country-select"
											// onBlur={HandleSelectOnBlur}
											// onFocus={HandleSelectOnFocus}
											defaultValue=""
										>
											<option value="" style={{ display: "none" }}></option>
											{countryCodes.map((country) => (
												<option key={country.code} value={country.code}>
													{country.name}
												</option>
											))}
										</Select>
									</FormControl>
								</div> */}
			<div className="grid-col-3 personal-info-wrapper">
				<div className="day-wrapper">
					<TextField
						// onBlur={CheckIsValid}
						// onFocus={RemoveMessages}
						className={`day ${getFieldClasses("day", visitedFields)}`}
						// onChange={HandleSecondStepText}
						id="Day"
						label="Day"
						variant="outlined"
						style={{ width: "100%" }}
						type="text"
						value={day}
						error={dayErrorMessage !== ""}
						// only allow digits
						onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))}
						onFocus={generateErrorResetter(setDayErrorMessage)}
						onBlur={() => {
							addVisitedField("day", visitedFields, setVisitedFields);
							checkDay();
						}}
					/>
					<span
						className="helping-text password-helper"
						style={{ marginBottom: "0px" }}
					>
						{dayErrorMessage}
					</span>
					<small
						style={{ fontSize: 12, color: "#7F7A7B" }}
						className="birthday"
					>
						Your birthday
					</small>
				</div>
				<div className="Month-select select-box">
					<FormControl
						className={`dropdown-form-control ${getFieldClasses(
							"month",
							visitedFields
						)}`}
					>
						<InputLabel
							htmlFor="age-native-simple"
							style={{ pointerEvents: "none" }}
						>
							Month
						</InputLabel>
						<Select
							native
							id="month-select"
							// TODO: change it to onFocus for others for consistency
							onFocus={() => {
								addVisitedField("month", visitedFields, setVisitedFields);
							}}
							value={month}
							onChange={(e) => setMonth(e.target.value as string)}
						>
							<option disabled value="" style={{ display: "none" }}></option>
							{Object.entries(months).map(([month, shortMonthName]) => (
								<option key={month} value={shortMonthName}>
									{shortMonthName}
								</option>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="text-field-wrapper">
					<TextField
						// onBlur={CheckIsValid}
						// onFocus={RemoveMessages}
						// onChange={HandleSecondStepText}
						className={`year ${getFieldClasses("year", visitedFields)}`}
						id="year"
						label="Year"
						variant="outlined"
						style={{ width: "100%" }}
						type="text"
						value={year}
						error={yearErrorMessage !== ""}
						// only allow digits
						onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
						onFocus={generateErrorResetter(setYearErrorMessage)}
						onBlur={() => {
							addVisitedField("year", visitedFields, setVisitedFields);
							checkYear();
						}}
					/>

					<span className="helping-text password-helper">
						{yearErrorMessage}
					</span>
				</div>
			</div>

			<TermsOfServiceNote
				{...{ hasUserAcceptedPolicies, setHasUserAcceptedPolicies }}
			/>

			<CustomButton disabled={!isSecondPageDataValid} style={{ width: "100%" }}>
				CREATE ACCOUNT
			</CustomButton>

			{/* <input
				type="submit"
				value=""
				id="create-accout"
				style={{ display: "none" }}
			/>
			<label
				htmlFor="create-accout"
				className={`create-account-label ${
					isSecondPageDataValid ? "" : "disable"
				}`}
				style={{
					cursor: "pointer",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "14px",
					height: 45,
				}}
			>
				CREATE ACCOUNT
			</label> */}
		</>
	);
}

function addVisitedField(
	field: string,
	visitedFields: string[],
	setVisitedFields: React.Dispatch<React.SetStateAction<string[]>>
) {
	if (visitedFields.includes(field)) return;
	setVisitedFields(visitedFields.concat([field]));

	// finally, change the actual value
	visitedFields.push(field);
}

function getFieldClasses(field: string, visitedFields: string[]) {
	return visitedFields.includes(field) ? "highlight-black" : "";
}

function TermsOfServiceNote({
	hasUserAcceptedPolicies,
	setHasUserAcceptedPolicies,
}: {
	hasUserAcceptedPolicies: boolean;
	setHasUserAcceptedPolicies: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<div
			className="checkbox-wrapper"
			style={{ marginBottom: 20, marginTop: 18 }}
		>
			<input
				type="checkbox"
				name=""
				// onChange={HandleSecondStepText}
				id="tos-checkbox"
				style={{ display: "none" }}
				checked={hasUserAcceptedPolicies}
				onChange={() => {
					setHasUserAcceptedPolicies(!hasUserAcceptedPolicies);
				}}
			/>
			<label>
				<label
					htmlFor="tos-checkbox"
					className="custom-checkbox custom-checkbox-box"
					// onClick={ShowPasswords}
					style={{ minWidth: 20 }}
				>
					<FontAwesomeIcon className="white-fa-check" icon={faCheck} />
				</label>
				<label
					htmlFor="tos-checkbox"
					className="custom-checkbox-line"
					// onClick={ShowPasswords}
					style={{
						fontSize: 13,
						color: "rgb(116, 112, 113)",
						fontWeight: 600,
					}}
				>
					(Required) By creating an account you agree that you've read and agree
					with the{" "}
					<Link
						// TODO: make that page
						href="/termsOfService"
						// style={{
						// 	color: "#000",
						// }}
					>
						terms of service
					</Link>{" "}
					and{" "}
					<Link
						//TODO: same here
						href="/privacyPolicy"
						// style={{
						// 	color: "#000",
						// }}
					>
						privacy policy
					</Link>
				</label>
			</label>
		</div>
	);
}

async function getPostcodeSuggestions(postcodeFragment: string): Promise<null> {
	postcodeFragment = postcodeFragment.toUpperCase().replaceAll(/[\W_]/g, "");

	// if too long, truncate
	if (postcodeFragment.length > 7)
		postcodeFragment = postcodeFragment.substr(0, 7);

	// pre-fill a full postcode
	let postcodesToCheck = [postcodeFragment];

	// if the length is 7, it has to be complete
	if (postcodeFragment.length < 7) {
		const res = await fetch(
			`https://api.postcodes.io/postcodes/${postcodeFragment}/autocomplete`
		);
		if (res.status !== 200) return null;

		const parsedRes = await res.json();

		postcodesToCheck = parsedRes.result;
	}

	// get data on postcodes
	const res = await fetch("https://api.postcodes.io/postcodes", {
		method: "POST",
		body: JSON.stringify({
			postcodes: postcodesToCheck,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const parsedRes = await res.json();
	console.log(parsedRes);
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
