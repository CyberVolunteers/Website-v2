import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/basicInfo.module.css";
import { FloatingInput } from "./FloatingInput";
import { EventHandle, HandleAllCheck } from "../js/handleInputs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel } from "@material-ui/core";
import Button from "./Button";
import { countryCodes, months } from "../utils/const";
import { UserClient } from "../../server/auth/data";
import { csrfFetch } from "../utils/csrf";
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));
type Gender = "" | "m" | "f" | "o";
export const BasicInfo = ({
	data,
	setData,
	csrfToken,
}: {
	data: UserClient;
	setData: Dispatch<SetStateAction<UserClient>>;
	csrfToken: string;
}) => {
	const [errorMessage, setErrorMessage] = useState("");

	const birthDate = new Date(data.birthDate);
	const [firstName, setFirstName] = useState(data.firstName);
	const [lastName, setLastName] = useState(data.lastName);
	const [address1, setAddress1] = useState(data.address1);
	const [address2, setAddress2] = useState(data.address2 ?? "");
	const [postcode, setPostcode] = useState(data.postcode);
	const [city, setCity] = useState(data.city);
	const [day, setDay] = useState("" + birthDate.getDate());
	// NOTE: see the note below
	const [month, setMonth] = useState(100);
	const [year, setYear] = useState("" + birthDate.getFullYear());
	const [gender, setGender] = useState("" as Gender);
	const [phone, setPhone] = useState(data.phoneNumber ?? "");
	// NOTE: this is a fix for the label not "rising" with pre-set values.
	useEffect(() => {
		setMonth(birthDate.getMonth());
		setGender((data.gender as Gender) ?? "");
	}, []);

	useEffect(() => {
		setErrorMessage("");
	}, [
		firstName,
		lastName,
		address1,
		address2,
		postcode,
		postcode,
		city,
		day,
		month,
		year,
		phone,
		gender,
	]);

	function resetValues() {
		setFirstName(data.firstName);
		setLastName(data.lastName);
		setAddress1(data.address1);
		setAddress2(data.address2 ?? "");
		setPostcode(data.postcode);
		setCity(data.city);
		setDay("" + birthDate.getDate());
		setMonth(birthDate.getMonth());
		setYear("" + birthDate.getFullYear());
		setGender((data.gender as Gender) ?? "");
		setPhone(data.phoneNumber ?? "");
	}

	const areThereChanges =
		firstName !== data.firstName ||
		lastName !== data.lastName ||
		address1 !== data.address1 ||
		address2 !== (data.address2 ?? "") ||
		postcode !== data.postcode ||
		city !== data.city ||
		day !== "" + birthDate.getDate() ||
		month !== birthDate.getMonth() ||
		year !== "" + birthDate.getFullYear() ||
		gender !== ((data.gender as Gender) ?? "") ||
		phone !== (data.phoneNumber ?? "");

	async function saveChanges() {
		const birthDate = new Date(parseInt(year), month, parseInt(day));
		if (birthDate instanceof Date && isNaN(birthDate.valueOf()))
			return setErrorMessage("Please enter a valid birth date");
		const res = await csrfFetch(csrfToken, "/api/updateUserBasicDetails", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({
				firstName,
				lastName,
				address1,
				address2,
				city,
				postcode,
				// TODO: sort out timezones
				birthDate: birthDate.toISOString(),
				gender: gender === "" ? undefined : gender,
				phoneNumber: phone === "" ? undefined : phone,
			}),
		});
		if (res.status >= 400) return setErrorMessage(await res.text());

		const newData = await res.json();
		// override the changes
		setData({ ...data, ...newData });
	}

	const classes = useStyles();
	// const [countryState, setcountry] = useState(
	// 	[] as { code: string; name: string }[]
	// );
	const [monthsState, setmonths] = useState([] as string[]);
	useEffect(() => {
		setmonths(Object.keys(months));
		// setcountry(countryCodes);
		EventHandle();

		window.addEventListener("load", (e) => {
			if (window.innerWidth < 500) {
				setmonths(Object.values(months));
				(
					document.querySelector(
						"#month_select_control .MuiInputBase-root"
					) as any
				).style.width = "26vw";
			} else {
				(
					document.querySelector(
						"#month_select_control .MuiInputBase-root"
					) as any
				).style.width = "100%";
			}
		});

		window.addEventListener("resize", (e) => {
			if (window.innerWidth < 500) {
				setmonths(Object.values(months));
				(
					document.querySelector(
						"#month_select_control .MuiInputBase-root"
					) as any
				).style.width = "26vw";
			} else {
				(
					document.querySelector(
						"#month_select_control .MuiInputBase-root"
					) as any
				).style.width = "100%";
			}
		});
	}, []);
	const HandleSelectOnBlur: React.FocusEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e) => {
		let Label = (e?.target?.parentNode as any).previousElementSibling;
		let BorderElement = e.target.parentNode;
		Label.style.color = "#000";
		(BorderElement as any).style.border = "1px solid #000 ";
	};
	const MarkActive: React.FocusEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e) => {
		let Label = (e?.target?.parentNode as any).previousElementSibling;
		Label.setAttribute("id", "active");
	};

	return (
		<div className={`${styles.BasicInfo} basic_info`} id="basic_info">
			<h2 className={styles.heading_2}>Basic Info</h2>
			<p className={styles.paraTop}>* denotes a required field</p>
			<div className={styles.inputWrappers}>
				<div className={`${styles.grid_two} first_input`}>
					<FloatingInput
						type="text"
						label="First Name*"
						value={firstName}
						onChange={(e) => {
							HandleAllCheck(e);
							setFirstName(e.target.value);
						}}
					/>
					<small className={styles.helperMessage}>Invalid First name</small>
				</div>
				<div
					className={`${styles.grid_two} second_input`}
					onChange={HandleAllCheck}
				>
					<FloatingInput
						type="text"
						label="Last Name*"
						value={lastName}
						onChange={(e) => {
							HandleAllCheck(e);
							setLastName(e.target.value);
						}}
					/>
					<small className={styles.helperMessage}>Invalid Last name</small>
				</div>
				<div className={styles.grid_three}>
					<div
						className="country-select gender_select select-box"
						style={{ marginTop: -15 }}
					>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="age-native-simple"
								style={{ pointerEvents: "none" }}
							>
								Gender
							</InputLabel>
							<Select
								native
								onChange={(e) => {
									let BorderElement = (e.target as any).parentNode;
									BorderElement.style.border = "1px solid #000 ";
									HandleAllCheck();
									setGender(e.target.value as Gender);
								}}
								id="country-select"
								onBlur={HandleSelectOnBlur}
								onFocus={MarkActive}
								value={gender}
							>
								<option value="" style={{ display: "none" }}></option>

								<option value="m">Male</option>
								<option value="f">Female</option>
								<option value="o">Other</option>
							</Select>
						</FormControl>
					</div>
				</div>
				<div className={`${styles.grid_three} third_input`}>
					<FloatingInput
						type="text"
						label="Address line 1*"
						value={address1}
						onChange={(e) => {
							HandleAllCheck(e);
							setAddress1(e.target.value);
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Address line 1</small>
				</div>
				<div className={`${styles.grid_three} fourth_input`}>
					<FloatingInput
						type="text"
						label="Address line 2"
						value={address2}
						onChange={(e) => {
							HandleAllCheck(e);
							setAddress2(e.target.value);
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Address line 2</small>
				</div>
				<div className={`${styles.grid_two} fifth_input`}>
					<FloatingInput
						type="text"
						label="Postcode*"
						value={postcode}
						onChange={(e) => {
							HandleAllCheck(e);
							setPostcode(e.target.value);
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Postcode</small>
				</div>
				<div className={`${styles.grid_two} sixth_input`}>
					<FloatingInput
						type="text"
						label="Town/City*"
						value={city}
						onChange={(e) => {
							HandleAllCheck(e);
							setCity(e.target.value);
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Town/City</small>
				</div>
				<div className={styles.grid_three}>
					{/* <div className="country-select select-box" style={{ marginTop: -15 }}>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="age-native-simple"
								style={{ pointerEvents: "none" }}
							>
								Country/Region
							</InputLabel>
							<Select
								native
								onChange={(e) => {
									let BorderElement = (e.target as any).parentNode;
									BorderElement.style.border = "1px solid #000 ";
									HandleAllCheck();
								}}
								id="country-select"
								onBlur={HandleSelectOnBlur}
								onFocus={HandleSelectOnFocus}
							>
								<option selected value="" style={{ display: "none" }}></option>
								{countryState.map((Eachcountry, i) => (
									<option key={i} value={Eachcountry.code}>
										{Eachcountry.name}
									</option>
								))}
							</Select>
						</FormControl>
					</div> */}
				</div>
				<div className={`${styles.grid_one} seven_input`}>
					<FloatingInput
						type="text"
						label="Day*"
						value={day}
						onChange={(e) => {
							HandleAllCheck(e);
							setDay(e.target.value.replace(/\D/g, ""));
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Day</small>
				</div>
				<div className={styles.grid_one}>
					<div
						className="country-select month_select select-box"
						style={{ marginTop: -15 }}
					>
						<FormControl
							className={classes.formControl}
							id="month_select_control"
						>
							<InputLabel
								// make it appear as if it has been selected
								id="active"
								htmlFor="age-native-simple"
								style={{ pointerEvents: "none" }}
							>
								Month *
							</InputLabel>
							<Select
								native
								onChange={(e) => {
									let BorderElement = (e.target as any).parentNode;
									BorderElement.style.border = "1px solid #000 ";
									HandleAllCheck(e);
									setMonth(parseInt(e.target.value as string));
								}}
								id="month-select"
								onBlur={HandleSelectOnBlur}
								onFocus={MarkActive}
								value={month}
							>
								{/* <option value="" style={{ display: "none" }}></option> */}
								{monthsState.map((month, i) => (
									<option key={i} value={i}>
										{month}
									</option>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className={`${styles.grid_one} eight_input`}>
					<FloatingInput
						type="text"
						label="Year*"
						value={year}
						onChange={(e) => {
							HandleAllCheck(e);
							setYear(e.target.value.replace(/\D/g, ""));
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Year</small>
				</div>{" "}
				<div className={`${styles.grid_three} nine_input`}>
					<FloatingInput
						type="text"
						label="Phone Number"
						value={phone}
						onChange={(e) => {
							HandleAllCheck(e);
							const value = e.target.value;
							const regexWithPlus = /[^\+0-9]/g;
							const regexWithoutPlus = /[^0-9]/g;
							if (value.length <= 1)
								setPhone(value.replaceAll(regexWithPlus, ""));
							else
								setPhone(
									value[0].replaceAll(regexWithPlus, "") +
										value.substr(1).replaceAll(regexWithoutPlus, "")
								);
						}}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Phone Number</small>
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
					onClick={() => resetValues()}
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
					className="skill_save_one"
					onClick={() => saveChanges()}
				>
					Save Changes
				</Button>
			</div>
			<div className={styles.error_message}>{errorMessage}</div>
		</div>
	);
};
