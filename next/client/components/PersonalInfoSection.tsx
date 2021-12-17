import React, { useEffect } from "react";
import { personalInfoSectionFields } from "../utils/const";
import Button from "./Button";
import styles from "../styles/personalInfoSection.module.css";
export const PersonalInfoSection = () => {
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
				<a href="#" className={styles.highlighted_text}>
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
				>
					Edit Personal Info
				</Button>
			</div>
		</div>
	);
};
