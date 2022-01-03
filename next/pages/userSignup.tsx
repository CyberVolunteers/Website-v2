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

import { csrfFetch } from "../client/utils/csrf";
import isEmail from "validator/lib/isEmail";
import { months, postcodeRE } from "../client/utils/const";
import { addVisitedField, getFieldClasses } from "../client/utils/formUtils";
import { useRouter } from "next/router";
import PasswordStrengthBar from "../client/components/PasswordStrengthBar";
import { cleanPostcode, generateErrorResetter } from "../client/utils/misc";
import AddressInput from "../client/components/AddressInput";
import BasicUserSignup from "../client/components/BasicUserSignup";

// TODO: make sure no text fields persist after a refresh
// TODO: a loading spinner
export default function UserSignup({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();

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

	const [requestErrorMessage, setRequestErrorMessage] = useState("");

	const [pageNum, setPageNum] = useState(0);

	async function handleMovingToNextPage() {
		if (!isFirstPageDataValid) return;
		if (pageNum === 0) {
			setRequestErrorMessage("");
			return setPageNum(1);
		}
		if (!isSecondPageDataValid) return;

		setRequestErrorMessage("");

		const dayNum = parseInt(secondPageData.day);
		const yearNum = parseInt(secondPageData.year);
		let monthNum = Object.values(months).indexOf(secondPageData.month);
		if (monthNum === -1)
			monthNum = Object.keys(months).indexOf(secondPageData.month);

		const birthDate = new Date(yearNum, monthNum, dayNum);

		const userData = {
			firstName: firstPageData.firstName,
			lastName: firstPageData.lastName,
			email: firstPageData.email,
			password: firstPageData.password,
			address1: secondPageData.addressLine1,
			address2: secondPageData.addressLine2,
			city: secondPageData.city,
			postcode: cleanPostcode(secondPageData.postcode),
			birthDate: birthDate.toISOString(),
		};

		const res = await csrfFetch(csrfToken, `/api/signupUser`, {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(userData),
		});
		if (res.status >= 400)
			return setRequestErrorMessage(`Error: ${await res.text()}`);
		router.push("/welcome");
	}

	return (
		<>
			<Head title="Sign up - cybervolunteers" />
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
									setRequestErrorMessage,
								}}
							/>
						) : (
							<SecondPage
								{...{
									isSecondPageDataValid,
									setSecondPageData,
									setIsSecondPageDataValid,
									setRequestErrorMessage,
								}}
							/>
						)}
						<span
							className="helping-text email-helper"
							style={{
								marginBottom: requestErrorMessage === "" ? "0px" : "20px",
							}}
						>
							{requestErrorMessage}
						</span>
					</CustomForm>
				</div>
			</div>
		</>
	);
}

function FirstPage({
	handleMovingToNextPage,
	isFirstPageDataValid,
	firstPageData,
	setFirstPageData,
	setIsFirstPageDataValid,
	setRequestErrorMessage,
}: {
	handleMovingToNextPage: () => void;
	isFirstPageDataValid: boolean;
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
	setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<>
			<div className="input-collection">
				<BasicUserSignup
					setData={setFirstPageData}
					setIsDataValid={setIsFirstPageDataValid}
					setRequestErrorMessage={setRequestErrorMessage}
				/>
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
	setRequestErrorMessage,
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
	setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [postcode, setPostcode] = useState("");
	const [month, setMonth] = useState("");
	const [city, setCity] = useState("");
	const [day, setDay] = useState("");
	const [year, setYear] = useState("");

	const [dayErrorMessage, setDayErrorMessage] = useState("");
	const [yearErrorMessage, setYearErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([] as string[]);

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
				postcodeRE.test(cleanPostcode(postcode))
		);
	}, [
		...allFieldVals,
		hasUserAcceptedPolicies,
		dayErrorMessage,
		yearErrorMessage,
		postcode,
	]);

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
			<AddressInput
				{...{
					addressLine1,
					setAddressLine1,
					addressLine2,
					setAddressLine2,
					city,
					postcode,
					setCity,
					setPostcode,
					setRequestErrorMessage,
				}}
			/>
			{/* <div className="country-select select-box">
									<FormControl className="dropdown-form-control">
										<InputLabel
											htmlFor="country-select"
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
						className={`day ${getFieldClasses("day", visitedFields)}`}
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
						style={{ marginBottom: "0px", paddingLeft: "3px" }}
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
							htmlFor="month-select"
							style={{ pointerEvents: "none", marginTop: "-15px" }}
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

					<span
						className="helping-text password-helper"
						style={{ paddingLeft: "3px" }}
					>
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
		</>
	);
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
					style={{ minWidth: 20 }}
				>
					<FontAwesomeIcon className="white-fa-check" icon={faCheck} />
				</label>
				<label
					htmlFor="tos-checkbox"
					className="custom-checkbox-line"
					style={{
						fontSize: 13,
						color: "rgb(116, 112, 113)",
						fontWeight: 600,
					}}
				>
					(Required) By creating an account you agree that {"you've"} read and
					agree with the{" "}
					<Link href="/downloads/termsOfUse.docx">terms of service</Link> and{" "}
					<Link href="/downloads/privacyPolicy.docx">privacy policy</Link>
				</label>
			</label>
		</div>
	);
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
