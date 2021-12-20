import React, { useState } from "react";
import styles from "../styles/floatingInput.module.css";
export const FloatingInput = ({
	type,
	label,
	onChange,
	value,
}: {
	type: string;
	label: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string;
}) => {
	const [active, setactive] = useState(value !== undefined && value !== "");
	const HandleBlurPosition: React.FocusEventHandler<HTMLInputElement> = (e) => {
		e.target.value != "" ? setactive(true) : setactive(false);
	};
	return (
		<div className={styles.FloatingInput}>
			<input
				type={type}
				className={`${styles.input} ${active && styles.activeinput} `}
				value={value}
				onChange={onChange}
				onBlur={HandleBlurPosition}
			/>{" "}
			<label
				htmlFor=""
				className={`${styles.label} ${active && styles.active}`}
			>
				{label}
			</label>
		</div>
	);
};
