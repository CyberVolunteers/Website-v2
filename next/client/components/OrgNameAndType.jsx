import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { HandleTextValidation } from "../js/ValidationOrganizationType";

import Link from "next/link";
import { CharitySignupTabType } from "../../pages/charitySignup";
import { useRouter } from "next/router";

function OrgNameAndType({
	setActiveTab,
	setOrgName,
	orgName,
	setOrgType,
	orgType,
}) {
	// : {
	// 	setOrgName: Dispatch<SetStateAction<string>>;
	// 	orgName: string;
	// 	setOrgType: Dispatch<SetStateAction<string>>;
	// 	orgType: string;
	// 	setActiveTab: Dispatch<SetStateAction<CharitySignupTabType>>;
	// }
	useEffect(() => {
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
						document.querySelector(".personal-info-wrapper").style.marginTop =
							"5px";
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
				HelperElement.textContent = "Invalid Organisation Name";
			} else if (ElementId == "lname") {
				HelperElement.textContent = "Invalid Organisation Type";
			}
		}
	};

	return (
		<>
			<p className="create-account-message">
				Create your Organisation’s account <br />
				below or <Link href="/login">sign in</Link>
			</p>{" "}
			{/* Can not be touched or it will break css */}
			<p className="welcom-message" style={{ display: "none" }}></p>
			<p className="helper">
				Once your organisation has an account with you will be able to create
				listings and recruit volunteer
			</p>
			<div className="input-collection">
				<TextField
					onBlur={CheckIsValid}
					onFocus={RemoveMessages}
					onChange={(e) => {
						setOrgName(e.target.value);
						HandleTextValidation(e);
					}}
					value={orgName}
					id="fname"
					label="Name of Organisation"
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
					onChange={(e) => {
						setOrgType(e.target.value);
						HandleTextValidation(e);
					}}
					value={orgType}
					id="lname"
					label="Type of Organisation"
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

				<div className="button-wrapper">
					<Link href="/login">
						<span style={{ color: "#F85220", cursor: "pointer" }}>
							Sign in instead{" "}
						</span>
					</Link>
					<Button
						variant="contained"
						color="primary"
						style={{ width: "100%" }}
						className="disable"
						onClick={() => {
							setActiveTab("orgBasicInfo");
						}}
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
}

export default OrgNameAndType;
