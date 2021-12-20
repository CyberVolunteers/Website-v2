import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";

import styles from "../styles/localHeader.module.css";
import { LocalHeaderItem } from "../utils/const";
export const LocalHeader = ({
	list,
	active,
	setActiveSection,
}: {
	list: LocalHeaderItem[];
	active: string;
	setActiveSection: Dispatch<
		SetStateAction<"General" | "Personal Information" | "Volunteering Stats">
	>;
}) => {
	const HandleDropDown = () => {
		if (typeof document !== "undefined")
			document.querySelector(".local-header")?.classList?.toggle?.("dropdown");
	};
	return (
		<div className={`${styles.LocalHeader} local-header  `}>
			<ul className={`w-1000 ${styles.list_wrapper}`}>
				{list.map((Item, i) => (
					<li className={styles.li} key={i}>
						{Item === undefined && (
							<div
								onClick={(e) => HandleDropDown()}
								className={`${styles.item_link} ${
									active === Item && styles.active
								}`}
							>
								{active}
								<i className={`fas fa-chevron-down ${styles.arrow}`}></i>
							</div>
						)}
						{Item !== undefined && (
							<div
								className={`${styles.item_link} ${
									active === Item && styles.active
								}`}
							>
								<div onClick={() => setActiveSection(Item)}>{Item}</div>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
