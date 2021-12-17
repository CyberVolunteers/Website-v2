import React, { useEffect, useState } from "react";
import styles from "../styles/basicInfo.module.css";
import { FloatingInput } from "./FloatingInput";
import { EventHandle, HandleAllCheck } from "../js/handleInputs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel } from "@material-ui/core";
import Button from "./Button";
import { countryCodes, months } from "../utils/const";
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));
export const BasicInfo = () => {
	const classes = useStyles();
	const [countryState, setcountry] = useState(
		[] as { code: string; name: string }[]
	);
	const [monthsState, setmonths] = useState([] as string[]);
	useEffect(() => {
		setmonths(Object.keys(months));
		setcountry(countryCodes);
		EventHandle();

		window.sessionStorage.removeItem("gender");
		window.sessionStorage.removeItem("month");
		window.sessionStorage.removeItem("country");

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
	const HandleSelectOnFocus: React.FocusEventHandler<
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
						onChange={HandleAllCheck}
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
						onChange={HandleAllCheck}
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
									window.sessionStorage.setItem("gender", true);
									HandleAllCheck();
								}}
								id="country-select"
								onBlur={HandleSelectOnBlur}
								onFocus={HandleSelectOnFocus}
							>
								<option selected value="" style={{ display: "none" }}></option>

								<option value="m">Male</option>
								<option value="f">Female</option>
							</Select>
						</FormControl>
					</div>
				</div>
				<div className={`${styles.grid_three} third_input`}>
					<FloatingInput
						type="text"
						label="Address line 1*"
						onChange={HandleAllCheck}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Address line 1</small>
				</div>
				<div className={`${styles.grid_three} fourth_input`}>
					<FloatingInput
						type="text"
						label="Address line 2*"
						onChange={HandleAllCheck}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Address line 2</small>
				</div>
				<div className={`${styles.grid_two} fifth_input`}>
					<FloatingInput
						type="text"
						label="Postcode*"
						onChange={HandleAllCheck}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Postcode</small>
				</div>
				<div className={`${styles.grid_two} sixth_input`}>
					<FloatingInput
						type="text"
						label="Town/City*"
						onChange={HandleAllCheck}
					/>{" "}
					<small className={styles.helperMessage}>Invalid Town/City</small>
				</div>
				<div className={styles.grid_three}>
					<div className="country-select select-box" style={{ marginTop: -15 }}>
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
									window.sessionStorage.setItem("country", true);
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
					</div>
				</div>
				<div className={`${styles.grid_one} seven_input`}>
					<FloatingInput type="text" label="Day*" onChange={HandleAllCheck} />{" "}
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
									// TODO: does this even do anything useful?
									window.sessionStorage.setItem("month", true);
									HandleAllCheck();
								}}
								id="month-select"
								onBlur={HandleSelectOnBlur}
								onFocus={HandleSelectOnFocus}
							>
								<option selected value="" style={{ display: "none" }}></option>
								{monthsState.map((month, i) => (
									<option key={i} value={month}>
										{month}
									</option>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className={`${styles.grid_one} eight_input`}>
					<FloatingInput type="text" label="Year*" onChange={HandleAllCheck} />{" "}
					<small className={styles.helperMessage}>Invalid Year</small>
				</div>{" "}
				<div className={`${styles.grid_three} nine_input`}>
					<FloatingInput
						type="text"
						label="Phone Number"
						onChange={HandleAllCheck}
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
				>
					Discard Changes
				</Button>
				<Button
					style={{
						backgroundColor: "transparent",
						color: "#333",
						borderColor: "#484848",
					}}
					className="skill_save_one"
				>
					Save Changes
				</Button>
			</div>
		</div>
	);
};
