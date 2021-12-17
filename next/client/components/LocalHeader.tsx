import Link from "next/link";
import React, { useState } from "react";

import styles from "../styles/localHeader.module.css";
export const LocalHeader = ({
	list,
	active,
}: {
	list: {
		value: string;
		redirection?: string;
	}[];
	active: string;
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
						{Item.value === "dropdown" && (
							<div
								onClick={(e) => HandleDropDown()}
								className={`${styles.item_link} ${
									active === Item.value && styles.active
								}`}
							>
								{active}
								<i className={`fas fa-chevron-down ${styles.arrow}`}></i>
							</div>
						)}
						{Item.redirection !== undefined && (
							<div
								className={`${styles.item_link} ${
									active === Item.value && styles.active
								}`}
							>
								<Link href={Item.redirection}>{Item.value}</Link>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
