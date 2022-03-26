import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { InputLabel } from "@material-ui/core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// import logo from "../../Assets/img/logo.svg";
// import "../../Assets/styles/css/Signin.css";
// import { countries, months, smallMonths } from "../../Assets/js/Utils";
import { HandleSecondStepTextInfomation } from "../js/ValidationSignUp";

// import { makeStyles } from "@material-ui/core/styles";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddressInput from "./AddressInput";
import { generateErrorResetter } from "../utils/misc";
import isMobilePhone from "validator/lib/isMobilePhone";
import { addVisitedField, getFieldClasses } from "../utils/formUtils";
import isURL from "validator/lib/isURL";
// import { CharitySignupTabType } from "../../pages/charitySignup";
// const useStyles = makeStyles((theme) => ({
// 	formControl: {
// 		margin: theme.spacing(1),
// 		minWidth: 120,
// 	},
// 	selectEmpty: {
// 		marginTop: theme.spacing(2),
// 	},
// }));

function OrgBasicInfo({
	setActiveTab,
	setRequestErrorMessage,

	addressLine1,
	addressLine2,
	city,
	postcode,
	phone,

	setAddressLine1,
	setAddressLine2,
	setCity,
	setPostcode,
	setPhone,
	websiteUrl,
	setWebsiteUrl,
}) {
	// : {
	// 	addressLine1: string;
	// 	setAddressLine1: Dispatch<SetStateAction<string>>;

	// 	addressLine2: string;
	// 	setAddressLine2: Dispatch<SetStateAction<string>>;

	// 	postcode: string;
	// 	setPostcode: Dispatch<SetStateAction<string>>;

	// 	city: string;
	// 	setCity: Dispatch<SetStateAction<string>>;

	// 	setActiveTab: Dispatch<SetStateAction<CharitySignupTabType>>;
	// 	setRequestErrorMessage: Dispatch<SetStateAction<string>>;

	// 	phone: string;
	// 	setPhone: Dispatch<SetStateAction<string>>;
	// }

	const [websiteUrlErrorMessage, setWebsiteUrlErrorMessage] = useState("");
	const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([]);
	const [isAddressDataValid, setIsAddressDataValid] = useState(false);

	const isValid =
		isAddressDataValid &&
		websiteUrl !== "" &&
		phone !== "" &&
		phoneErrorMessage === "" &&
		websiteUrlErrorMessage === "" &&
		isURL(websiteUrl) &&
		isMobilePhone(phone);

	return (
		<>
			<p className="create-account-message">
				Let’s get some basic info about your organisation
			</p>

			<div className="input-collection">
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
						setIsDataValid: setIsAddressDataValid,
					}}
				/>

				<TextField
					onBlur={(e) => {
						addVisitedField("websiteUrl", visitedFields, setVisitedFields);
						if (e.target.value === "" || !isURL(e.target.value))
							setWebsiteUrlErrorMessage("Please enter a valid website URL");
					}}
					onFocus={generateErrorResetter(setWebsiteUrlErrorMessage)}
					onChange={(e) => {
						setWebsiteUrl(e.target.value);
						HandleSecondStepTextInfomation(e);
					}}
					className={`websiteUrl ${getFieldClasses(
						"websiteUrl",
						visitedFields
					)}`}
					id="URL"
					label="Website URL"
					value={websiteUrl}
					error={websiteUrlErrorMessage !== ""}
					variant="outlined"
					autoComplete="on"
					style={{ width: "100%" }}
				/>
				<span className="helping-text text-helper">
					{websiteUrlErrorMessage}
				</span>

				<TextField
					onBlur={(e) => {
						addVisitedField("phone", visitedFields, setVisitedFields);
						if (e.target.value === "" || !isMobilePhone(e.target.value))
							setPhoneErrorMessage("Please enter a valid phone number");
					}}
					error={phoneErrorMessage !== ""}
					onChange={(e) => {
						setPhone(e.target.value);
					}}
					className={`phone ${getFieldClasses("phone", visitedFields)}`}
					id="PHONE"
					label="Phone"
					value={phone}
					variant="outlined"
					autoComplete="on"
					style={{ width: "100%" }}
					onFocus={generateErrorResetter(setPhoneErrorMessage)}
				/>
				<span className="helping-text text-helper">{phoneErrorMessage}</span>

				<div className="button-wrapper width_100_button">
					<Button
						variant="contained"
						color="primary"
						className={`${isValid ? "" : "disable"} create-account-label`}
						onClick={() => {
							if (!isValid) return;
							setActiveTab("orgMission");
						}}
					>
						NEXT
					</Button>
				</div>
			</div>
		</>
	);
}

export default OrgBasicInfo;
