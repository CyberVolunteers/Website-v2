import React, { RefObject, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";

import { useWindowSize } from "../utils/otherHooks";
import { useViewerType } from "../utils/userState";

import styles from "../styles/header.module.css";
import { useIsAfterRehydration } from "../utils/otherHooks";
import { ViewerType } from "../types";
import { useRouter } from "next/dist/client/router";
import { pagesWithReducedHeaderAndFooter } from "../utils/const";

function Header() {
	const sidebarLimitWidth = 600;
	const isAfterRehydration = useIsAfterRehydration();

	const router = useRouter();

	const userType = useViewerType();
	const isLoggedIn = (
		["user", "org", "unverified_user", "unverified_org"] as ViewerType[]
	).includes(userType);

	const [isDropdownUp, setIsDropdownUp] = useState(false);

	const [isSidebarUp, setIsSidebarUp] = useState(false);
	const [searchKeywords, setSearchKeywords] = useState("");
	const windowSize = useWindowSize();

	const windowWidth = windowSize.width ?? 1000; // to make sure that the larger version is displayed otherwise
	const isLargeVersion = windowWidth > sidebarLimitWidth;

	const dropdownRef: RefObject<HTMLLIElement> = useRef(null);

	function onClickOutsideOfDropdown(e: MouseEvent) {
		if (dropdownRef.current?.contains?.(e.target as Node)) return;
		setIsDropdownUp(false);
	}

	// wait for clicks outside
	useEffect(() => {
		document.addEventListener("click", onClickOutsideOfDropdown, true);
		return () => {
			document.removeEventListener("click", onClickOutsideOfDropdown, true);
		};
	}, []);

	// If the page needs the "simplistic" header
	if (pagesWithReducedHeaderAndFooter.includes(router.pathname))
		return (
			<>
				<Link href="/" passHref>
					<a className={`${styles["simplified-header"]}`}>
						<img
							className={`pointer ${styles["simplified-header-img"]}`}
							src="/img/logo.svg"
							alt="Our logo"
						/>
					</a>
				</Link>
			</>
		);

	const onSearch: React.FormEventHandler<HTMLFormElement> = (evt) => {
		evt.preventDefault();
		router.push(
			`/searchListings?${new URLSearchParams({
				keywords: searchKeywords,
			})}`
		);
	};

	const manageListingsEl = (
		<Link href="/manageListings" passHref>
			<a>
				<p>Manage listings</p>
			</a>
		</Link>
	);

	const volunteerEl = (
		<Link href="/searchListings" passHref>
			<a>
				<p>Volunteer</p>
			</a>
		</Link>
	);

	const myAccountEl = (
		<Link href="/myAccount" passHref>
			<a>
				<p>My Account</p>
			</a>
		</Link>
	);

	const signInEl = (
		<Link href="/login" passHref>
			<a>
				<p>Sign in</p>
			</a>
		</Link>
	);

	const userSignUpEl = (
		<Link href="/userSignup" passHref>
			<a>
				<p>Sign up</p>
			</a>
		</Link>
	);

	const charitySignUpEl = (
		<Link href="/charitySignup" passHref>
			<a>
				<p>Create a charity</p>
			</a>
		</Link>
	);

	const aboutUsEl = (
		<Link href="/aboutUs" passHref>
			<a>
				<p>About Us</p>
			</a>
		</Link>
	);

	return (
		<>
			{/* The sidebar */}
			{isAfterRehydration && isSidebarUp && !isLargeVersion ? (
				<aside className={`${styles["sidebar"]}`}>
					{isLoggedIn ? (
						<li>{myAccountEl}</li>
					) : (
						<>
							<li>{userSignUpEl}</li>
							<li>{charitySignUpEl}</li>
						</>
					)}
					<li>
						{["org", "unverified_org"].includes(userType)
							? manageListingsEl
							: volunteerEl}
					</li>
					<li>{aboutUsEl}</li>

					{/* <li>
						<Link href="/contactUs" passHref>
							<a>
								<p>Contact us</p>
							</a>
						</Link>
					</li> */}
				</aside>
			) : null}

			<header className={`${styles["Header"]}`}>
				<div
					className={`${styles["header-content"]} w-1000 dflex-align-center`}
				>
					<Link href="/" passHref>
						<a style={{ marginTop: "5px" }}>
							<img className="pointer" src="/img/logo.svg" alt="Our logo" />
						</a>
					</Link>
					<span className={styles.header_links}>
						{isAfterRehydration && (
							<>
								{isLargeVersion ? (
									<ul className="dflex-align-center">
										<li className={`${styles["head"]} dflex-align-center`}>
											{["org", "unverified_org"].includes(userType)
												? manageListingsEl
												: volunteerEl}
										</li>
									</ul>
								) : null}
								{/* because it resizes automatically, we need to disable it to prevent flicker */}
								<form onSubmit={onSearch} className={styles.hide}>
									<div
										className={`${styles["input-wrapper"]} dflex-align-center`}
									>
										<SearchIcon />
										<input
											type="text"
											placeholder="Search Here..."
											value={searchKeywords}
											onChange={(v) => setSearchKeywords(v.currentTarget.value)}
										/>
									</div>
									<button type="submit" style={{ display: "none" }} />
								</form>
								<ul className="dflex-align-center">
									{/* because it resizes automatically, we need to disable it to prevent flicker */}
									{/* <div
										style={{ cursor: "pointer" }}
										className={`${styles["head"]} dflex-align-center`}
									>
										<p>About us</p>
										<p>About</p>
										<ArrowDropDownIcon /> 
									</div> */}

									{/* <ul className={`${styles["body"]}`}>
								<li>
									<Link href="/aboutUs" passHref>
										<a>
											<p>About Us</p>
										</a>
									</Link>
								</li>
								<li>
									<Link href="/contactUs" passHref>
										<a>
											<p>Contact us</p>
										</a>
									</Link>
								</li>
							</ul> */}

									{!isLargeVersion ? null : (
										<>
											{isLoggedIn ? (
												<>
													<li>{aboutUsEl}</li>
													<li>{myAccountEl}</li>
												</>
											) : (
												<>
													<li>{aboutUsEl}</li>
													<li
														className={`${styles["drop-down"]} ${styles["dropdown-wrapper"]} ${styles["about-wrapper"]}`}
														onMouseEnter={() => {
															setIsDropdownUp(true);
														}}
														onMouseLeave={() => {
															setIsDropdownUp(false);
														}}
														ref={dropdownRef}
													>
														<div
															style={{ cursor: "pointer" }}
															className={`${styles["head"]} ${
																isDropdownUp ? styles.rotated : ""
															} dflex-align-center`}
															onTouchStart={() => {
																setIsDropdownUp(!isDropdownUp);
															}}
														>
															<p>Sign Up</p>
															<ArrowDropDownIcon />
														</div>
														<ul
															className={`${styles["body"]}`}
															style={{
																display: isDropdownUp ? "grid" : "none",
															}}
														>
															<li>{userSignUpEl}</li>
															<li>{charitySignUpEl}</li>
														</ul>
													</li>
													<li>{signInEl}</li>
												</>
											)}
										</>
									)}

									{/* Only show on small screens and when not on certain pages */}
									{!isLargeVersion &&
									!isLoggedIn &&
									![
										"/login",
										"/organisationSignup",
										"/userSignup",
										"/listing",
									].includes(router.pathname) ? (
										<li className={styles.bottomButton}>
											<Link href="/login" passHref>
												<a>
													<p>Sign in</p>
												</a>
											</Link>
										</li>
									) : null}
								</ul>
							</>
						)}
					</span>
					<div
						className={`${styles["burger-icon"]}`}
						onClick={(e) => setIsSidebarUp(!isSidebarUp)}
					>
						<MenuIcon />
					</div>
				</div>
			</header>
		</>
	);
}

export default Header;
