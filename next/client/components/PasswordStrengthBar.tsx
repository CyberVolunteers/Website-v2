import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";

export default function PasswordStrengthBar({
	password,
	passwordStrength,
	setPasswordStrength,
}: {
	password: string;
	passwordStrength: number;
	setPasswordStrength: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [passwordStrengthNotes, setPasswordStrengthNotes] = useState("");

	useEffect(() => {
		if (password === "") {
			setPasswordStrength(0);
			setPasswordStrengthNotes("");
		} else {
			const result = zxcvbn(password);
			const score = result.score;
			const passwordStrengthSummary = [
				"A very weak password",
				"A weak password",
				"A medium password",
				"A strong password",
				"A very strong password",
			][score];

			// because the score bar goes from 1 to 4 inclusive
			setPasswordStrengthNotes(passwordStrengthSummary);
			setPasswordStrength(Math.min(score + 1, 4));
		}
	}, [password]);

	return passwordStrengthNotes === "" || passwordStrength === 0 ? null : (
		<div className="password-ui-strong" style={{ marginTop: 10 }}>
			<div className="bars" style={{ marginBottom: 5 }}>
				{[1, 2, 3, 4].map((barIdNumber) => (
					<span
						key={barIdNumber}
						className={`bar ${
							passwordStrength < barIdNumber
								? ""
								: `password-strength-bar-level-${passwordStrength}`
						}`}
						id={`bar-${barIdNumber}`}
					></span>
				))}
			</div>

			<p style={{ fontSize: 12, marginTop: 10 }} className="passwordStrength">
				Password Strength: {passwordStrengthNotes}
			</p>
		</div>
	);
}
