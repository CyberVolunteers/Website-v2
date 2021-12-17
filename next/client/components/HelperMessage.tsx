import React, { useState } from "react";
import { Danger } from "./Danger";
import styles from "../styles/helperMessage.module.css";
export const HelperMessage = () => {
	const [clicked, setClicked] = useState(false);
	return (
		<div className={styles.help_container}>
			<Danger text="Our email is not yet verified, please check <email address> for a verification email. Your email must be verified to sign up for volunteering opportunities." />
			<p className={styles.helper_message}>
				Didn’t receive a verification email? We can send you
				<span
					className={styles.highlighted_text}
					style={{ cursor: "pointer" }}
					onClick={(e) => setClicked(true)}
				>
					{" "}
					a new one
				</span>
				. Or change your
				<a href="#" className={styles.highlighted_text}>
					{" "}
					email address
				</a>
			</p>
			{clicked && (
				<Danger
					text="We've sent a new verification email to mytechlife96@gmail.com. Please check your email to verify your account"
					style={{ marginTop: 10, background: "#F75524" }}
				/>
			)}
		</div>
	);
};
