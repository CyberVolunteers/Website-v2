import React from "react";
import styles from "../styles/volunteerCause.module.css";
import { categoryNames } from "../utils/const";

import Button from "./Button";

export const VolunteerCause = () => {
	const volunteeredFor = [0, 2];
	return (
		<div className={styles.VolunteerCause}>
			<p className={styles.first_para}>
				You have volunteered for <b>1/9</b> causes.
			</p>

			<div className={styles.do_or_dont}>
				<div className={styles.left_side}>
					<p>Causes you have volunteered for:</p>
					{volunteeredFor.map((el) => (
						<div key={el} className={styles.listItem}>
							{" "}
							<div className={styles.imageWrapper}>
								<img src={`/img/cause${el}.png`} alt="" />
							</div>
							<p>{categoryNames[el]}</p>
						</div>
					))}
				</div>
				<div className={styles.right_side}>
					<p>Causes you haven’t volunteered for:</p>
					{categoryNames.map((el, i) =>
						volunteeredFor.includes(i) ? null : (
							<div className={styles.listItem}>
								{" "}
								<div className={styles.imageWrapper}>
									<img src={`/img/cause${i}.png`} alt="" />
								</div>
								<p>{el}</p>
							</div>
						)
					)}
				</div>
			</div>
			<div className={styles.buttonWrapper}>
				<Button style={{ width: 210, fontSize: "16px" }}>
					Find an opportunity
				</Button>
			</div>
		</div>
	);
};
