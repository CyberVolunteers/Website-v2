import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";

import styles from "../styles/localHeader.module.css";
import { LocalHeaderItem } from "../utils/const";
import { useWindowSize } from "../utils/otherHooks";
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
	const [isDropdownActive, setIsDropdownActive] = useState(false);
	const isSmallScreen = (useWindowSize()?.width ?? 0) < 460;
	const showDropdown = isDropdownActive && isSmallScreen;

	const HandleDropDown = () => {
		if (typeof document !== "undefined")
			document.querySelector(".local-header")?.classList?.toggle?.("dropdown");
	};

	return (
		<div className={`${styles.LocalHeader} local-header`}>
			<ul className={`w-1000 ${styles.list_wrapper}`}>
				{list.map((Item, i) => (
					<li className={styles.li} key={i}>
						{Item === undefined && (
							<div
								onClick={() => setIsDropdownActive(!isDropdownActive)}
								className={`${styles.item_link} ${
									active === Item && styles.active
								}`}
							>
								<div
									style={{
										padding:
											isSmallScreen && !showDropdown ? "0rem" : undefined,
									}}
								>
									{active}
									<FontAwesomeIcon
										className={styles.dropdownArrow}
										style={{
											transform: isDropdownActive
												? "rotate(180deg)"
												: undefined,
										}}
										icon={faChevronDown}
									/>
								</div>
							</div>
						)}
						{Item !== undefined && (!isSmallScreen || showDropdown) && (
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
