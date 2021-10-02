import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import logo from "../public/img/logo.svg";
import { countries, months, smallMonths } from "../client/js/Utils";
import {
	HandleEmailValidation,
	HandlePasswordValidation,
	HandleTextValidation,
	HandleConfirmPasswordValidation,
	HandleSecondStepText,
} from "../client/js/ValidationSignUp";
import {
	HandleSecondStepOnBlur,
	HandleSecondStepOnFocuse,
} from "../client/js/AddressWorking";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { makeStyles } from "@material-ui/core/styles";
import { InputLabel } from "@material-ui/core";

import Link from "next/link";
import Head from "../client/components/Head";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

function Signup() {
	const classes = useStyles();
	const [FirstName, setFirstName] = useState();
	const [LastName, setLastName] = useState();
	const [monthsState, setmonths] = useState([]);
	const [countryState, setcountry] = useState([]);

	useEffect(() => {
		setmonths(months);
		setcountry(countries);

		window.addEventListener("load", (e) => {
			if (window.innerWidth < 500) {
				setmonths(smallMonths);
			}
		});

		window.addEventListener("resize", (e) => {
			if (window.innerWidth < 500) {
				setmonths(smallMonths);
			}
		});

		document.querySelector("#fname").addEventListener("change", (e) => {
			setFirstName(e.target.value);
		});
		document.querySelector("#lname").addEventListener("change", (e) => {
			setLastName(e.target.value);
		});

		document
			.querySelectorAll(".typing-start-result .firstpart .row")
			.forEach((Each) =>
				Each.addEventListener("click", () => {
					document.querySelector(
						".typing-start-result .firstpart"
					).style.display = "none";

					document.querySelector(
						".typing-start-result .secondpart"
					).style.display = "block";

					document.querySelector("#address").focus();
				})
			);

		document
			.querySelectorAll(".typing-start-result .secondpart .row")
			.forEach((Each) => {
				Each.addEventListener("click", (e) => {
					let location = e.target.querySelector("small");
					let Address1 = document.querySelector("#address1");
					let Adress = document.querySelector("#address");
					let label = Address1.parentNode.previousElementSibling;
					let BorderElement = Address1.nextElementSibling;

					label.style.color = "#000";
					BorderElement.style.borderColor = "#000";

					document.querySelector(".address-wrapper").style.display = "none";
					document.querySelector(".result-wrapper").style.display = "none";
					document.querySelector(".expand-address").classList.add("active");
					document.querySelector(".country-select").style.marginTop = "-16px";
					document.querySelector(".personal-info-wrapper").style.marginTop =
						"5px";

					Address1.value = location.textContent;
				});
			});
	}, []);
	const HandleNext = (e) => {
		e.preventDefault();
		document.querySelector(".input-collection").style.display = "none";
		document.querySelector(".step-2").style.display = "block";
		document.querySelector(".create-account-message").style.display = "none";
		document.querySelector(".welcome-message").style.display = "block";
	};
	const ShowPasswords = (e) => {
		let PasswordsElements = document.querySelectorAll(".password");

		let type = "";
		PasswordsElements.forEach((EachElement) => {
			let Input = EachElement.querySelector("input");
			type = Input.getAttribute("type") == "text" ? "password" : "text";
			Input.setAttribute("type", type);
		});
	};
	const RemoveMessages = (e) => {
		let ElementId = e.target.id;
		let BorderElement = e.target.nextElementSibling;
		let Label = e.target.parentNode.previousElementSibling;
		let HelperElement = "";

		HelperElement = e.target.parentNode.parentNode.nextElementSibling;

		let NotCorrect = document.querySelector(".not-correct");

		BorderElement.style.border = "1px solid rgba(0, 0, 0, 0.23)";
		Label.style.color = "rgba(0, 0, 0, 0.23)";

		if (e.target.id == "password") {
			HelperElement.style.display = "none";
		}
		if (e.target.id != "Day") {
			HelperElement.textContent = "";
		}
		if (e.target.id == "Day") {
			HelperElement.style.display = "none";
		}
		if (
			ElementId == "address1" ||
			ElementId == "address2" ||
			ElementId == "postcode" ||
			ElementId == "town"
		) {
			HelperElement.parentNode.style.marginBottom = "0px";
		}
		if (
			e.target.id == "passsword" ||
			e.target.id == "email" ||
			e.target.id == "fname" ||
			e.target.id == "lname" ||
			e.target.id == "fname" ||
			e.target.id == "address1" ||
			e.target.id == "address2" ||
			e.target.id == "postcode" ||
			e.target.id == "town"
		) {
			HelperElement.style.marginBottom = "10px";
		}

		NotCorrect.style.display = "none";

		if (e.target.id == "year") {
			document.querySelector(".birthday").classList.remove("active");
		}
		if (e.target.id == "year") {
			document.querySelector(".birthday").classList.remove("active");
		}
		HelperElement.classList.remove("day-active");
	};

	const HandleSelectOnFocus = (e) => {
		let Label = e.target.parentNode.previousElementSibling;

		Label.setAttribute("id", "active");
		console.log(Label);
	};
	const HandleSelectOnBlur = (e) => {
		let Label = e.target.parentNode.previousElementSibling;
		let BorderElement = e.target.parentNode;

		Label.style.color = "#000";
		BorderElement.style.border = "1px solid #000 ";
	};
	const CheckIsValid = (e) => {
		let BorderElement = e.target.nextElementSibling;
		let Label = e.target.parentNode.previousElementSibling;
		let ParentElement = e.target.parentNode.parentNode;
		let email =
			/^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{1,8})(\.[a-z]{1,8})?(\.[a-z]{1,8})?$/;
		let password = /^[\d\w\$#@&%!^*-]{8,26}$/i;
		let HelperElement = "";

		// if(e.target.id=='password'){
		//     HelperElement=e.target.parentNode.parentNode.nextElementSibling.nextElementSibling

		// }else{
		HelperElement = e.target.parentNode.parentNode.nextElementSibling;
		// }

		if (e.target.value == "") {
			BorderElement.style.border = "1px solid red";
			Label.style.color = "red";

			if (
				e.target.id == "passsword" ||
				e.target.id == "email" ||
				e.target.id == "fname" ||
				e.target.id == "lname" ||
				e.target.id == "fname"
			) {
				HelperElement.style.marginBottom = "20px";
			}
			if (
				e.target.id == "address1" ||
				e.target.id == "address2" ||
				e.target.id == "postcode" ||
				e.target.id == "town"
			) {
				HelperElement.style.marginBottom = "9px";
			}

			if (e.target.id != "password" || e.target.id != "email") {
				HelperElement.style.display = "inline-block";
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
			if (e.target.id == "Day") {
			} else {
				HelperElement = e.target.parentNode.parentNode.nextElementSibling;
				HelperElement.textContent = "";
			}
		}

		if (e.target.id == "email") {
			if (!email.test(e.target.value)) {
				BorderElement.style.border = "1px solid red";
				Label.style.color = "red";
				HelperElement.textContent = "Invalid Email";
				HelperElement.style.marginBottom = "20px";
			}
		} else if (e.target.value == "") {
			let ElementId = e.target.id;
			BorderElement.style.border = "1px solid red";
			Label.style.color = "red";
			if (ElementId == "fname") {
				HelperElement.textContent = "Invalid First name";
			} else if (ElementId == "lname") {
				HelperElement.textContent = "Invalid Last name";
			} else if (ElementId == "Password") {
				HelperElement.textContent = "Invalid Password";
			} else if (ElementId == "ConfirmPassword") {
				HelperElement.textContent = "Invalid Confirm Password";
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
			} else if (ElementId == "Day") {
				HelperElement.style.display = "block";
				HelperElement.classList.add("day-active");
				document.querySelector(".birthday").classList.remove("active");
			} else if (ElementId == "year") {
				HelperElement.textContent = "Invalid year";

				console.log(document.querySelector(".day-active"));
				if (document.querySelector(".day-active") == null) {
					document.querySelector(".birthday").classList.add("active");
				}
			}
		}
	};

	return (
		<>
			<Head title="Sign up as a volunteer - cybervolunteers" />
			<div className="SignIn SignUp">
				<div className="body-area">
					<form action="" className="outer-form">
						<p className="create-account-message">
							Create a new account below <br />
							or <Link href="/">sign in</Link>
						</p>
						<p className="welcome-message" style={{ display: "none" }}>
							{FirstName}, welcome to Cyber Volunteers
						</p>
						<p className="helper">Create a new Cyber Volunteers account.</p>

						<div className="input-collection">
							<TextField
								onBlur={CheckIsValid}
								onFocus={RemoveMessages}
								onChange={HandleTextValidation}
								id="fname"
								label="First name"
								autoComplete="on"
								variant="outlined"
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
								onChange={HandleTextValidation}
								id="lname"
								label="Last name"
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
								onChange={HandleEmailValidation}
								id="email"
								label="Email"
								autoComplete="on"
								variant="outlined"
								style={{ width: "100%" }}
							/>
							<span
								className="helping-text email-helper"
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
								className="password"
								onChange={HandlePasswordValidation}
								id="password"
								label="Password"
								variant="outlined"
								style={{ width: "100%" }}
								type="password"
								onFocus={RemoveMessages}
							/>

							<span
								className="helping-text password-helper"
								style={{
									marginBottom: "0px",
									display: "none",
									marginTop: 7,
									fontSize: 13,
									paddingLeft: 12,
									color: "#F65B4E",
								}}
							></span>

							<div
								className="password-ui-strong"
								style={{ marginTop: 10, marginBottom: 10 }}
							>
								<div className="bars" style={{ marginBottom: 5 }}>
									<span className="bar" id="bar-1"></span>
									<span className="bar" id="bar-2"></span>
									<span className="bar" id="bar-3"></span>
									<span className="bar" id="bar-4"></span>
								</div>
								<p
									style={{ fontSize: 12, marginTop: 10 }}
									className="passwordStrength"
								>
									Password Strength: Lorem ipsum Lorem ipsum Lorem ipsum Lorem
									ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
								</p>
							</div>

							<TextField
								onBlur={CheckIsValid}
								className="password"
								onChange={HandleConfirmPasswordValidation}
								id="ConfirmPassword"
								label="Confirm Password"
								variant="outlined"
								style={{ width: "100%", marginTop: ".6rem" }}
								type="password"
								onFocus={RemoveMessages}
							/>

							<span
								className="helping-text password-helper"
								style={{
									marginBottom: "10px",
									display: "inline-block",
									marginTop: 7,
									fontSize: 13,
									paddingLeft: 12,
									color: "#F65B4E",
								}}
							></span>

							<span
								className="helping-text not-correct"
								style={{
									marginBottom: "10px",
									display: "none",
									marginTop: 7,
									fontSize: 13,
									paddingLeft: 0,
									color: "#F65B4E",
								}}
							>
								Email or password is not recognised
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
								/>
								<label
									htmlFor="show-password-checkbox"
									id="forget-password-wrapper"
									onClick={ShowPasswords}
								>
									<label
										htmlFor="show-password-checkbox"
										className="custom-checkbox custom-checkbox-box show-password-label"
									>
										<i className="fas fa-check"></i>
									</label>
									<p> Show password</p>
								</label>
							</div>

							<div className="button-wrapper">
								<Link style={{ color: "#F85220" }} href="/">
									Sign in instead
								</Link>
								<Button
									variant="contained"
									color="primary"
									style={{ width: "100%" }}
									className="disable"
									onClick={HandleNext}
								>
									Next
								</Button>
							</div>
						</div>

						<div className="step-2">
							<form
								autoComplete="off"
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
									className="address"
									id="address"
									autoComplete="off"
									onFocus={HandleSecondStepOnFocuse}
									onBlur={HandleSecondStepOnBlur}
									onChange={HandleSecondStepText}
									label="Enter you street address"
									variant="outlined"
									style={{ width: "100%", marginTop: 20 }}
									type="text"
								/>
								<small
									style={{
										fontSize: "12px",
										color: " rgb(127, 122, 123)",
										position: "absolute",
										width: "100%",
										left: "0%",
									}}
									className="available-message"
								>
									Cyber Volunteers is only available in the UK
								</small>
							</form>

							<div
								className="result-wrapper"
								style={{
									position: "relative",
									zIndex: 2222,
									backgroundColor: "#fff",
								}}
							>
								<p>e.g. “SW12 7EU” or “64 London Road”</p>
								<div
									className="typing-start-result"
									style={{ display: "none" }}
								>
									<div className="firstpart">
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>

										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
											<p>75 results</p>
										</div>

										<Link
											href="/"
											// to="#"
											className="manual-address"
											onClick={(e) => {
												e.preventDefault();

												document.querySelector(
													".address-wrapper"
												).style.display = "none";
												document.querySelector(
													".result-wrapper"
												).style.display = "none";
												document
													.querySelector(".expand-address")
													.classList.add("active");
												document.querySelector(
													".country-select"
												).style.marginTop = "-16px";
											}}
											style={{
												display: "block",
												color: "#F85220",
												fontSize: "15px",
												textAlign: "center",
												borderTop: "1px solid #ddd",
												padding: "10px 0px",
											}}
										>
											Enter address manually
										</Link>
									</div>

									<div className="secondpart" style={{ display: "none" }}>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
										</div>
										<div className="row">
											<div className="left-presentation">
												<h5>Atif Asim</h5>
												<small>Pakistan</small>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="expand-address" style={{ marginTop: 20 }}>
								<div className="text-field-wrapper">
									<TextField
										className="address"
										id="address1"
										onChange={HandleSecondStepText}
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										label="Address Line 1"
										variant="outlined"
										style={{ width: "100%" }}
										type="text"
									/>
									<span
										className="helping-text password-helper"
										style={{
											display: "inline-block",
											marginTop: 7,
											fontSize: 13,
											paddingLeft: 12,
											color: "#F65B4E",
										}}
									></span>
								</div>
								<div className="text-field-wrapper">
									<TextField
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										className="address"
										id="address2"
										onChange={HandleSecondStepText}
										label="Address Line 2"
										variant="outlined"
										style={{ width: "100%" }}
										type="text"
									/>
									<span
										className="helping-text password-helper"
										style={{
											display: "inline-block",
											marginTop: 7,
											fontSize: 13,
											paddingLeft: 12,
											color: "#F65B4E",
										}}
									></span>
								</div>
								<div className="text-field-wrapper">
									<TextField
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										className="address"
										id="postcode"
										onChange={HandleSecondStepText}
										label="Postcode"
										variant="outlined"
										style={{ width: "100%" }}
										type="text"
									/>
									<span
										className="helping-text password-helper"
										style={{
											display: "inline-block",
											marginTop: 7,
											fontSize: 13,
											paddingLeft: 12,
											color: "#F65B4E",
										}}
									></span>
								</div>
								<div className="text-field-wrapper">
									<TextField
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										className="address"
										id="town"
										onChange={HandleSecondStepText}
										label="Town/City"
										variant="outlined"
										style={{ width: "100%" }}
										type="text"
									/>
									<span
										className="helping-text password-helper"
										style={{
											display: "inline-block",
											marginTop: 7,
											fontSize: 13,
											paddingLeft: 12,
											color: "#F65B4E",
										}}
									></span>
								</div>
							</div>
							<div className="country-select select-box">
								<FormControl className={classes.formControl}>
									<InputLabel
										htmlFor="age-native-simple"
										style={{ pointerEvents: "none" }}
									>
										Country/Region
									</InputLabel>
									<Select
										native
										onChange={HandleSecondStepText}
										id="country-select"
										onBlur={HandleSelectOnBlur}
										onFocus={HandleSelectOnFocus}
									>
										<option
											selected
											value=""
											style={{ display: "none" }}
										></option>
										{countryState.map((Eachcountry, i) => (
											<option key={i} value={Eachcountry.code}>
												{Eachcountry.name}
											</option>
										))}
									</Select>
								</FormControl>
							</div>

							<div className="grid-col-3 personal-info-wrapper">
								<div className="day-wrapper" style={{ marginTop: 16 }}>
									<TextField
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										className="Day"
										onChange={HandleSecondStepText}
										id="Day"
										label="Day"
										variant="outlined"
										style={{ width: "100%" }}
										type="text"
									/>
									<span
										className="helping-text day-helper"
										style={{
											display: "none",
											marginTop: 7,
											fontSize: 13,
											color: "#F65B4E",
										}}
									>
										Invalid Day
									</span>
									<small
										style={{ fontSize: 12, color: "#7F7A7B" }}
										className="birthday"
									>
										Your birthday
									</small>
								</div>
								<div className="Month-select select-box">
									<FormControl className={classes.formControl}>
										<InputLabel
											htmlFor="age-native-simple"
											style={{ pointerEvents: "none" }}
										>
											Month
										</InputLabel>
										<Select
											native
											onChange={HandleSecondStepText}
											id="month-select"
											onBlur={HandleSelectOnBlur}
										>
											<option
												disabled
												selected
												value=""
												style={{ display: "none" }}
											></option>
											{monthsState.map((EachMonth, i) => (
												<option key={i} value={EachMonth}>
													{EachMonth}
												</option>
											))}
										</Select>
									</FormControl>
								</div>
								<div className="text-field-wrapper">
									<TextField
										onBlur={CheckIsValid}
										onFocus={RemoveMessages}
										onChange={HandleSecondStepText}
										className="address"
										id="year"
										label="Year"
										variant="outlined"
										style={{ width: "100%", marginTop: 16 }}
										type="text"
									/>
									<span
										className="helping-text password-helper"
										style={{
											display: "inline-block",
											marginTop: 7,
											fontSize: 13,
											paddingLeft: 12,
											color: "#F65B4E",
										}}
									></span>
								</div>
							</div>

							<div
								className="checkbox-wrapper"
								style={{ marginBottom: 20, marginTop: 18 }}
							>
								<input
									type="checkbox"
									name=""
									onChange={HandleSecondStepText}
									id="AggrementCheckbox"
									style={{ display: "none" }}
								/>
								<label>
									<label
										htmlFor="AggrementCheckbox"
										className="custom-checkbox custom-checkbox-box"
										onClick={ShowPasswords}
										style={{ minWidth: 20 }}
									>
										<i className="fas fa-check"></i>
									</label>
									<label
										htmlFor="AggrementCheckbox"
										className="custom-checkbox-line"
										onClick={ShowPasswords}
										style={{
											fontSize: 13,
											color: "rgb(116, 112, 113)",
											fontWeight: 600,
										}}
									>
										By creating an account you agree that you've read and agree
										with the{" "}
										<Link
											href="/"
											// to="/termsOfService"
											style={{
												color: "#000",
											}}
										>
											terms of service
										</Link>{" "}
										and{" "}
										<Link
											href="/"
											// to="/privacyPolicy"
											style={{
												color: "#000",
											}}
										>
											privacy policy
										</Link>
									</label>
								</label>
							</div>

							<input
								type="submit"
								value=""
								id="create-accout"
								style={{ display: "none" }}
							/>
							<label
								htmlFor="create-accout"
								className="create-account-label disable"
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
							</label>
						</div>
					</form>
				</div>

				<p style={{ textAlign: "center", color: "#949494", marginBottom: 20 }}>
					© 2021 Cyber Volenteers. All rights reserved.
				</p>
			</div>
		</>
	);
}

export default Signup;
