import React from "react";
import styles from "../styles/volunteer.module.css";
import Button from "./Button";

export const Volunteer = ({
	participationNumber,
}: {
	participationNumber: number;
}) => {
	return (
		<div className={styles.voulenteer}>
			<h2 className={styles.sub_heading}>
				You have volunteered {participationNumber} times.
			</h2>
			<div
				className={styles.buttonWrapper}
				// NOTE: remove this if you are bringing the "volunteering stats" button back to center them.
			>
				<Button href="/searchListings">Find an opportunity</Button>
				{/* <Button
					style={{
						backgroundColor: "transparent",
						color: "#333",
						borderColor: "#484848",
					}}
					outline={true}
				>
					Volunteering Stats
				</Button> */}
			</div>
		</div>
	);
};
