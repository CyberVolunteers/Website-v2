import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import React, { useEffect, useState } from "react";

// import logo from "../../Assets/img/logo.svg";
// import "../../Assets/styles/css/Signin.css";
// import { countries, months, smallMonths } from "../../Assets/js/Utils";
// import { HandleTextValidation } from "../../Assets/js/ValidationOrganizationType";

// import "../../Assets/styles/css/Signup.css";

// import { makeStyles } from "@material-ui/core/styles";

// import "../../Assets/styles/css/SelectBox.css";
// import "../../Assets/styles/css/resultsWrapper.css";
// import stylesHeader from "../../Assets/styles/css/header.module.css";
// import "../../Assets/styles/css/Form.css";
// import "../../Assets/styles/css/body.css";

// import { Link } from "react-router-dom";
// const useStyles = makeStyles((theme) => ({
// 	formControl: {
// 		margin: theme.spacing(1),
// 		minWidth: 120,
// 	},
// 	selectEmpty: {
// 		marginTop: theme.spacing(2),
// 	},
// }));

// function OrganizationAccount() {
// 	const classes = useStyles();
// 	const [FirstName, setFirstName] = useState();
// 	const [LastName, setLastName] = useState();
// 	const [monthsState, setmonths] = useState([]);
// 	const [countryState, setcountry] = useState([]);

// 	useEffect(() => {
// 		setmonths(months);
// 		setcountry(countries);

// 		window.addEventListener("load", (e) => {
// 			if (window.innerWidth < 500) {
// 				setmonths(smallMonths);
// 			}
// 		});

// 		window.addEventListener("resize", (e) => {
// 			if (window.innerWidth < 500) {
// 				setmonths(smallMonths);
// 			}
// 		});

// 		document.querySelector("#fname").addEventListener("change", (e) => {
// 			setFirstName(e.target.value);
// 		});
// 		document.querySelector("#lname").addEventListener("change", (e) => {
// 			setLastName(e.target.value);
// 		});

// 		document
// 			.querySelectorAll(".typing-start-result .firstpart .row")
// 			.forEach((Each) =>
// 				Each.addEventListener("click", (e) => {
// 					e.target.classList.add("blue_bg");
// 					setTimeout(() => {
// 						e.target.classList.remove("blue_bg");
// 					}, 200);

// 					setTimeout(() => {
// 						document.querySelector(
// 							".typing-start-result .firstpart"
// 						).style.display = "none";

// 						document.querySelector(
// 							".typing-start-result .secondpart"
// 						).style.display = "block";

// 						document.querySelector("#address").focus();
// 					}, 500);
// 				})
// 			);

// 		document
// 			.querySelectorAll(".typing-start-result .secondpart .row")
// 			.forEach((Each) => {
// 				Each.addEventListener("click", (e) => {
// 					e.target.classList.add("blue_bg");
// 					let location = e.target.querySelector("small");
// 					let Address1 = document.querySelector("#address1");
// 					let Adress = document.querySelector("#address");
// 					let label = Address1.parentNode.previousElementSibling;
// 					let BorderElement = Address1.nextElementSibling;

// 					label.style.color = "#000";
// 					BorderElement.style.borderColor = "#000";
// 					setTimeout(() => {
// 						e.target.classList.remove("blue_bg");
// 					}, 200);
// 					setTimeout(() => {
// 						document.querySelector(".address-wrapper").style.display = "none";
// 						document.querySelector(".result-wrapper").style.display = "none";
// 						document.querySelector(".expand-address").classList.add("active");
// 						document.querySelector(".country-select").style.marginTop = "-16px";
// 						document.querySelector(".personal-info-wrapper").style.marginTop =
// 							"5px";
// 					}, 500);
// 					Address1.value = location.textContent;
// 				});
// 			});
// 	}, []);

// 	const RemoveMessages = (e) => {
// 		let BorderElement = e.target.nextElementSibling;
// 		let Label = e.target.parentNode.previousElementSibling;
// 		let HelperElement = "";

// 		HelperElement = e.target.parentNode.parentNode.nextElementSibling;

// 		BorderElement.style.border = "1px solid rgba(0, 0, 0, 0.23)";
// 		Label.style.color = "rgba(0, 0, 0, 0.23)";

// 		if (e.target.id == "fname" || e.target.id == "lname") {
// 			HelperElement.style.marginBottom = "10px";
// 		}

// 		HelperElement.classList.remove("day-active");
// 	};

// 	const CheckIsValid = (e) => {
// 		let BorderElement = e.target.nextElementSibling;
// 		let Label = e.target.parentNode.previousElementSibling;
// 		let ParentElement = e.target.parentNode.parentNode;
// 		let email =
// 			/^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{1,8})(\.[a-z]{1,8})?(\.[a-z]{1,8})?$/;
// 		let password = /^[\d\w\$#@&%!^*-]{8,26}$/i;
// 		let HelperElement = "";

// 		HelperElement = e.target.parentNode.parentNode.nextElementSibling;

// 		if (e.target.value == "") {
// 			BorderElement.style.border = "1px solid red";
// 			Label.style.color = "red";

// 			if (e.target.id == "fname" || e.target.id == "lname") {
// 				HelperElement.style.marginBottom = "20px";
// 			}

// 			if (HelperElement.classList[1] == "email-helper") {
// 				HelperElement.textContent = "Please enter the email";
// 			} else if (HelperElement.classList[1] == "password-helper") {
// 				HelperElement.textContent = "Please enter the password";
// 				if (e.target.id == "password") {
// 				}
// 			}
// 		} else {
// 			Label.style.color = "#000";
// 			BorderElement.style.border = "1px solid #000";

// 			HelperElement = e.target.parentNode.parentNode.nextElementSibling;
// 			HelperElement.textContent = "";
// 		}
// 		if (e.target.value == "") {
// 			let ElementId = e.target.id;
// 			BorderElement.style.border = "1px solid red";
// 			Label.style.color = "red";
// 			if (ElementId == "fname") {
// 				HelperElement.textContent = "Invalid Organisation Name";
// 			} else if (ElementId == "lname") {
// 				HelperElement.textContent = "Invalid Organisation Type";
// 			}
// 		}
// 	};

// 	return (
// 		<div className={`${stylesHeader.SignUp} SignUp`}>
// 			<div className={`${stylesHeader.sign_in_header} sign-in-header`}>
// 				<img src={logo} alt="" />
// 			</div>
// 			<div className="body-area">
// 				<form action="" className="outer-form">
// 					<p className="create-account-message">
// 						Create your Organisation’s account <br />
// 						below or <Link to="/welcome">sign in</Link>
// 					</p>{" "}
// 					<p className="welcom-message" style={{ display: "none" }}>
// 						{FirstName}, welcome to Cyber Volunteers
// 					</p>
// 					<p className="helper">
// 						Once your organisation has an account with you will be able to
// 						create listings and recruit volunteer
// 					</p>
// 					<div className="input-collection">
// 						<TextField
// 							onBlur={CheckIsValid}
// 							onFocus={RemoveMessages}
// 							onChange={HandleTextValidation}
// 							id="fname"
// 							label="Name of Organisation"
// 							autocomplete="on"
// 							variant="outlined"
// 							style={{ width: "100%" }}
// 						/>
// 						<span
// 							className="helping-text text-helper"
// 							style={{
// 								marginBottom: "10px",
// 								display: "inline-block",
// 								marginTop: 7,
// 								fontSize: 13,
// 								paddingLeft: 12,
// 								color: "#F65B4E",
// 							}}
// 						></span>

// 						<TextField
// 							onBlur={CheckIsValid}
// 							onFocus={RemoveMessages}
// 							onChange={HandleTextValidation}
// 							id="lname"
// 							label="Type of Organisation"
// 							variant="outlined"
// 							autocomplete="on"
// 							style={{ width: "100%" }}
// 						/>
// 						<span
// 							className="helping-text text-helper"
// 							style={{
// 								marginBottom: "20px",
// 								display: "inline-block",
// 								marginTop: 7,
// 								fontSize: 13,
// 								paddingLeft: 12,
// 								color: "#F65B4E",
// 							}}
// 						></span>

// 						<div className="button-wrapper">
// 							<Link style={{ color: "#F85220" }}>Sign in instead</Link>
// 							<Button
// 								variant="contained"
// 								color="primary"
// 								style={{ width: "100%" }}
// 								className="disable"
// 							>
// 								Next
// 							</Button>
// 						</div>
// 					</div>
// 				</form>
// 			</div>

// 			<p style={{ textAlign: "center", color: "#949494", marginBottom: 20 }}>
// 				© 2021 Cyber Volenteers. All rights reserved.
// 			</p>
// 		</div>
// 	);
// }

// export default OrganizationAccount;
