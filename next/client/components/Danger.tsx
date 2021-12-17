import React, { CSSProperties } from "react";
import styles from "../styles/danger.module.css";
export const Danger = ({
	img = null,
	text,
	style = {},
}: {
	img?: string | null;
	text: string;
	style?: CSSProperties;
}) => {
	return (
		<div className={styles.Danger} style={style}>
			{img && <img src={img} alt="" />}
			<p className={styles.text}>{text}</p>
		</div>
	);
};
