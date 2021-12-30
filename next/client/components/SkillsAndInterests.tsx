import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/skillsAndInterests.module.css";
import { EventHandle } from "../js/handleInputs";
import { FloatingInput } from "./FloatingInput";
import Button from "./Button";
import { UserClient } from "../../server/auth/data";
import { csrfFetch } from "../utils/csrf";

export const SkillsAndInterests = ({
	csrfToken,
	data,
	setData,
}: {
	data: UserClient;
	setData: Dispatch<SetStateAction<UserClient>>;
	csrfToken: string;
}) => {
	const [occupation, setOccupation] = useState(data.occupation ?? "");
	const [languages, setLanguages] = useState(data.languages ?? "");
	const [skillsAndInterests, setSkillsAndInterests] = useState(
		data.skillsAndInterests ?? ""
	);

	useEffect(() => {
		setErrorMessage("");
	}, [occupation, languages, skillsAndInterests]);

	const [errorMessage, setErrorMessage] = useState("");

	function resetValues() {
		setOccupation(data.occupation ?? "");
		setLanguages(data.languages ?? "");
		setSkillsAndInterests(data.skillsAndInterests ?? "");
	}

	const areThereChanges =
		occupation !== (data.occupation ?? "") ||
		languages !== (data.languages ?? "") ||
		skillsAndInterests !== (data.skillsAndInterests ?? "");

	async function saveChanges() {
		const res = await csrfFetch(csrfToken, "/api/updateUserSelfDescription", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				occupation,
				languages,
				skillsAndInterests,
			}),
		});
		if (res.status >= 400) return setErrorMessage(await res.text());

		const newData = await res.json();
		// override the changes
		setData({ ...data, ...newData });
	}

	const [TextAreaActive, setTextAreaActive] = useState(
		skillsAndInterests !== ""
	);
	useEffect(() => {
		EventHandle();

		const HandleAllCheck: EventListenerOrEventListenerObject = (e) => {
			let FirstInput = document.querySelector(".first_input_skill input");
			let SecondInput = document.querySelector(".second_input_skill input");
			let TextArea = document.querySelector("textarea");
			if (
				(FirstInput as any).value != "" &&
				(SecondInput as any).value != "" &&
				TextArea?.value != ""
			) {
				(document.querySelector(".skill_save_two") as any).classList.add(
					"active"
				);
			} else {
				(document.querySelector(".skill_save_two") as any).classList.remove(
					"active"
				);
			}
		};

		document
			.querySelectorAll(".basic_info_skill input")
			.forEach((EachInput) => {
				EachInput.addEventListener("keyup", HandleAllCheck);
			});
		document
			.querySelectorAll(".basic_info_skill textarea")
			.forEach((EachInput) => {
				EachInput.addEventListener("keyup", HandleAllCheck);
			});
	}, []);
	return (
		<div className={`${styles.BasicInfo} basic_info_skill`} id="Skills">
			<h2 className={styles.heading_2}>Your Skills and Interests</h2>

			<div className={styles.inputWrappers}>
				<div className={`${styles.grid_three} first_input_skill`}>
					<FloatingInput
						type="text"
						label="Occupation"
						value={occupation}
						onChange={(e) => setOccupation(e.target.value)}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Occupation</small>
				</div>{" "}
				<div className={`${styles.grid_three} second_input_skill`}>
					<FloatingInput
						type="text"
						label="Languages"
						value={languages}
						onChange={(e) => setLanguages(e.target.value)}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Languages</small>
				</div>{" "}
				<div
					className={`${styles.grid_three} ${styles.textareaWrapper} ${
						TextAreaActive == true && styles.text_area_active
					}`}
				>
					<textarea
						name=""
						cols={30}
						rows={10}
						onChange={(e) => {
							if (e.target.value != "") {
								setTextAreaActive(true);
							} else {
								setTextAreaActive(false);
							}
							setSkillsAndInterests(e.target.value);
						}}
						style={
							TextAreaActive
								? {
										borderColor: "#212121",
								  }
								: {
										borderColor: "#cecece",
								  }
						}
						className={styles.textArea}
						value={skillsAndInterests}
					></textarea>
					<label htmlFor="">Your Skills and Interests.</label>
				</div>
			</div>

			<div className={styles.buttonsWrapper}>
				<Button
					style={{
						backgroundColor: "transparent",
						color: "#333",
						borderColor: "#484848",
					}}
					outline={true}
					onClick={resetValues}
				>
					Discard Changes
				</Button>
				<Button
					isHighlighted={areThereChanges}
					style={{
						backgroundColor: "transparent",
						color: "#333",
						borderColor: areThereChanges ? "" : "#484848",
					}}
					className="skill_save_two"
					onClick={saveChanges}
				>
					Save Changes
				</Button>
			</div>
			<div className={styles.error_message}>{errorMessage}</div>
		</div>
	);
};
