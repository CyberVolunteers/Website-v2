import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { MouseEventHandler } from "react";

import styles from "../styles/backButton.module.css";

export default function BackButton({
	text,
	href,
	onClick,
}: {
	text: string;
} & {
	href?: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
}) {
	const el = (
		<div onClick={onClick} className={styles.back_link_wrapper}>
			<div className={styles.content_back_link}>
				<div className={styles.back_pure_link}>
					<FontAwesomeIcon icon={faArrowLeft} style={{ paddingTop: "3px" }} />
					<p className={styles.back_link_para}>{text}</p>
				</div>
			</div>
		</div>
	);
	if (href === undefined) return el;
	return <Link href={href}>{el}</Link>;
}
