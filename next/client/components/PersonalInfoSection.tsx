import React, { Dispatch, SetStateAction, useEffect } from "react";
import Button from "./Button";
import styles from "../styles/personalInfoSection.module.css";
import { UserClient } from "../../server/auth/data";
import { months } from "../utils/const";

const notSpecifiedText = "Not specified";

export const PersonalInfoSection = ({
	data,
	setActiveSection,
}: {
	data: UserClient;
	setActiveSection: Dispatch<
		SetStateAction<"General" | "Personal Information" | "Volunteering Stats">
	>;
}) => {
	const {
		firstName,
		lastName,
		address1,
		address2,
		birthDate: birthDateString,
		email,
		gender,
		phoneNumber,
		occupation,
		skillsAndInterests,
		languages,
	} = data;
	const birthDate = new Date(birthDateString);
	const personalInfoSectionFields = [
		{
			left: "Name*",
			right: `${firstName} ${lastName}`,
		},
		{
			left: "Birthday*",
			right: `${birthDate.getDate()} ${
				Object.values(months)[birthDate.getMonth()]
			} ${birthDate.getFullYear()}`,
		},
		{
			left: "Email*",
			right: email,
		},
		{
			left: "Password",
			right: "••••••••",
		},
		{
			left: "Address*",
			right: `${address1} ${address2 === undefined ? "" : ", " + address2}`,
		},
		{
			left: "Gender",
			right:
				gender === "m"
					? "Male"
					: gender === "f"
					? "Female"
					: gender === "o"
					? "Other"
					: notSpecifiedText,
		},
		{
			left: "Phone Number",
			right:
				phoneNumber === undefined || phoneNumber === ""
					? notSpecifiedText
					: phoneNumber,
		},
		{
			left: "Occupation",
			right:
				occupation === undefined || occupation === ""
					? notSpecifiedText
					: occupation,
		},
		{
			left: "Skills and interests",
			right:
				skillsAndInterests === undefined || skillsAndInterests === ""
					? notSpecifiedText
					: skillsAndInterests,
		},
		{
			left: "Languages",
			right:
				languages === undefined || languages === ""
					? notSpecifiedText
					: languages,
		},
	];

	// TODO: why does that even work?
	const AddAddintional = (EachRight: Element & { offsetWidth: number }) => {
		if (EachRight.offsetWidth < EachRight.scrollWidth) {
			EachRight.classList.add("active");
		} else {
			EachRight.classList.remove("active");
		}
	};
	useEffect(() => {
		let FeildRights = document.querySelectorAll(".feild_right");

		FeildRights.forEach((EachRight: Element) => {
			AddAddintional(EachRight as Element & { offsetWidth: number });
		});

		window.addEventListener("resize", (e) => {
			FeildRights.forEach((EachRight: Element) => {
				AddAddintional(EachRight as Element & { offsetWidth: number });
			});
		});
	}, []);
	return (
		<div className={styles.PersonalInfo}>
			<h2 className={styles.sub_heading}>Your Personal Information.</h2>
			<p className={styles.helper_message}>
				Your personal information is incomplete. Tell charities more about
				yourself by completing your{" "}
				<a
					href="#"
					className={styles.highlighted_text}
					onClick={() => setActiveSection("Personal Information")}
				>
					account information.
				</a>
			</p>{" "}
			<small className={styles.info_message}>* denotes a required field</small>
			{personalInfoSectionFields.map((Field, i) => (
				<div className={styles.fieldWrapper} key={i}>
					<label className={styles.fieldWrapperlabel}>{Field.left}</label>
					<p className={`${styles.fieldWrapperinput} feild_right`}>
						{Field.right}
					</p>
				</div>
			))}
			<div className={styles.button_wrapper}>
				<Button
					style={{
						marginTop: 30,
						backgroundColor: "transparent",
						color: "#333",
						borderColor: "#484848",
					}}
					outline={true}
					onClick={() => setActiveSection("Personal Information")}
				>
					Edit Personal Info
				</Button>
			</div>
		</div>
	);
};
