import React, { useState } from "react";
import { Danger } from "./Danger";
import styles from "../styles/helperMessage.module.css";
import { useRouter } from "next/router";
export const HelperMessage = ({ email }: { email: string }) => {
	const router = useRouter();
	const [clicked, setClicked] = useState(false);
	return (
		<div className={styles.help_container}>
			<Danger
				text={`Your email is not yet verified, please check ${email} for a verification
email. Your email must be verified to sign up for volunteering opportunities.`}
			/>
			<p className={styles.helper_message}>
				Didn’t receive a verification email? We can send you
				<span
					className={styles.highlighted_text}
					style={{ cursor: "pointer" }}
					onClick={() => router.push("/sendEmailConfirmationEmail")}
				>
					{" "}
					a new one
				</span>
				. Or change your
				<a
					href="#"
					onClick={() => router.push("/changeEmail")}
					className={styles.highlighted_text}
				>
					{" "}
					email address.
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
