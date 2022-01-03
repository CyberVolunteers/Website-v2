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
	// const classes = useStyles();
	// const [month, setMonth] = useState("");
	// const [countryState, setcountry] = useState([]);

	useEffect(() => {
		// setmonths(months);
		// // setcountry(countries);

		// window.addEventListener("load", (e) => {
		// 	if (window.innerWidth < 500) {
		// 		setmonths(smallMonths);
		// 	}
		// });

		// window.addEventListener("resize", (e) => {
		// 	if (window.innerWidth < 500) {
		// 		setmonths(smallMonths);
		// 	}
		// });

		document
			.querySelectorAll(".typing-start-result .firstpart .row")
			.forEach((Each) =>
				Each.addEventListener("click", (e) => {
					e.target.classList.add("blue_bg");
					setTimeout(() => {
						e.target.classList.remove("blue_bg");
					}, 200);

					setTimeout(() => {
						document.querySelector(
							".typing-start-result .firstpart"
						).style.display = "none";

						document.querySelector(
							".typing-start-result .secondpart"
						).style.display = "block";

						document.querySelector("#address").focus();
					}, 500);
				})
			);

		document
			.querySelectorAll(".typing-start-result .secondpart .row")
			.forEach((Each) => {
				Each.addEventListener("click", (e) => {
					e.target.classList.add("blue_bg");
					let location = e.target.querySelector("small");
					let Address1 = document.querySelector("#address1");
					let Adress = document.querySelector("#address");
					let label = Address1.parentNode.previousElementSibling;
					let BorderElement = Address1.nextElementSibling;

					label.style.color = "#000";
					BorderElement.style.borderColor = "#000";
					setTimeout(() => {
						e.target.classList.remove("blue_bg");
					}, 200);
					setTimeout(() => {
						document.querySelector(".address-wrapper").style.display = "none";
						document.querySelector(".result-wrapper").style.display = "none";
						document.querySelector(".expand-address").classList.add("active");
						document.querySelector(".country-select").style.marginTop = "-16px";
					}, 500);
					Address1.value = location.textContent;
				});
			});
	}, []);
	const RemoveMessages = (e) => {
		let BorderElement = e.target.nextElementSibling;
		let Label = e.target.parentNode.previousElementSibling;
		let HelperElement = "";

		HelperElement = e.target.parentNode.parentNode.nextElementSibling;

		BorderElement.style.border = "1px solid rgba(0, 0, 0, 0.23)";
		Label.style.color = "rgba(0, 0, 0, 0.23)";

		if (e.target.id == "fname" || e.target.id == "lname") {
			HelperElement.style.marginBottom = "10px";
		}

		HelperElement.classList.remove("day-active");
	};

	const CheckIsValid = (e) => {
		let BorderElement = e.target.nextElementSibling;
		let Label = e.target.parentNode.previousElementSibling;
		let ParentElement = e.target.parentNode.parentNode;
		let email =
			/^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{1,8})(\.[a-z]{1,8})?(\.[a-z]{1,8})?$/;
		let password = /^[\d\w\$#@&%!^*-]{8,26}$/i;
		let HelperElement = "";

		HelperElement = e.target.parentNode.parentNode.nextElementSibling;

		if (e.target.value == "") {
			BorderElement.style.border = "1px solid red";
			Label.style.color = "red";

			if (e.target.id == "fname" || e.target.id == "lname") {
				HelperElement.style.marginBottom = "20px";
			}

			if (HelperElement.classList[1] == "email-helper") {
				HelperElement.textContent = "Please enter the email";
			} else if (HelperElement.classList[1] == "password-helper") {
				HelperElement.textContent = "Please enter the password";
				if (e.target.id == "password") {
				}
			}
		} else {
			Label.style.color = "#000";
			BorderElement.style.border = "1px solid #000";

			HelperElement = e.target.parentNode.parentNode.nextElementSibling;
			HelperElement.textContent = "";
		}
		if (e.target.value == "") {
			let ElementId = e.target.id;
			BorderElement.style.border = "1px solid red";
			Label.style.color = "red";
			if (ElementId == "fname") {
				HelperElement.textContent = "Invalid Address";
			} else if (ElementId == "lname") {
				HelperElement.textContent = "Invalid Country/Region";
			} else if (ElementId == "URL") {
				HelperElement.textContent = "Invalid Website URL";
			} else if (ElementId == "PHONE") {
				HelperElement.textContent = "Invalid Phone Number";
			} else if (ElementId == "address1") {
				HelperElement.textContent = "Invalid Adress 1";
				HelperElement.parentNode.style.marginBottom = "10px";
			} else if (ElementId == "address2") {
				HelperElement.textContent = "Invalid Adress 2";
				HelperElement.parentNode.style.marginBottom = "10px";
			} else if (ElementId == "postcode") {
				HelperElement.textContent = "Invalid postcode";
				HelperElement.parentNode.style.marginBottom = "10px";
			} else if (ElementId == "town") {
				HelperElement.textContent = "Invalid town";
				HelperElement.parentNode.style.marginBottom = "10px";
			}
		}
	};

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
					}}
				/>
				{/* <div className="country-select select-box">
							<FormControl className={classes.formControl}>
								<InputLabel
									htmlFor="age-native-simple"
									style={{ pointerEvents: "none", marginTop: "-15px" }}
								>
									Country/Region
								</InputLabel>
								<Select
									onChange={HandleSecondStepTextInfomation}
									native
									id="country-select"
									onBlur={HandleSelectOnBlur}
									onFocus={HandleSelectOnFocus}
								>
									<option
										selected
										value=""
										style={{ display: "none" }}
									></option>
									{countryState.map((Eachcountry) => (
										<option value={Eachcountry.code}>{Eachcountry.name}</option>
									))}
								</Select>
							</FormControl>
						</div> */}
				{/* <div
							className="checkbox-wrapper password-checkbox-wrapper"
							style={{ marginBottom: 20, marginTop: 5 }}
						>
							<input
								type="checkbox"
								name=""
								id="show-password-checkbox"
								style={{ display: "none" }}
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
								<p> Don’t publicly display this address</p>
							</label>
						</div> */}

				<TextField
					onBlur={CheckIsValid}
					onFocus={RemoveMessages}
					onChange={HandleSecondStepTextInfomation}
					id="URL"
					label="Website URL"
					variant="outlined"
					autoComplete="on"
					style={{ width: "100%" }}
				/>
				<span
					className="helping-text text-helper"
					style={{
						marginBottom: "10px",
						display: "inline-block",
						marginTop: 7,
						fontSize: 13,
						paddingLeft: 12,
						color: "#F65B4E",
					}}
				></span>

				<TextField
					onBlur={CheckIsValid}
					onFocus={RemoveMessages}
					onChange={(e) => {
						setPhone(e.target.value);
						HandleSecondStepTextInfomation(e);
					}}
					id="PHONE"
					label="Phone"
					value={phone}
					variant="outlined"
					autoComplete="on"
					style={{ width: "100%" }}
				/>
				<span
					className="helping-text text-helper"
					style={{
						marginBottom: "20px",
						display: "inline-block",
						marginTop: 7,
						fontSize: 13,
						paddingLeft: 12,
						color: "#F65B4E",
					}}
				></span>

				<div className="button-wrapper width_100_button">
					<Button
						variant="contained"
						color="primary"
						className={`disable create-account-label`}
						onClick={() => {
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
