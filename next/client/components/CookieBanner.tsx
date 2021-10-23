// import styles from "../styles/card.module.css";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { allowedCookiesCookieName } from "../../serverAndClient/cookiesConfig";
import { getCookie } from "../utils/userState";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const cookieTypes = [
	{
		id: "required",
		name: "Strictly necessory Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
		isAlwaysActive: true,
	},
	{
		id: "functional",
		name: "Functional Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
	},
	{
		id: "performance",
		name: "Performance Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
	},
	{
		id: "targeting",
		name: "Trageting Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
	},
];

function PlusSign(props: { onClick: () => void }) {
	return (
		<div className="plus-sign" onClick={props.onClick}>
			<span className="horizontal"></span>
			<span className="vertical"></span>
		</div>
	);
}

function setAll<T>(arr: Dispatch<SetStateAction<T>>[], val: T) {
	arr.forEach((v, i) => arr[i](val));
}

function CookieBanner() {
	const [isBannerShown, setIsBannerShown] = useState(false);
	const [isPopupShown, setIsPopupShown] = useState(false);
	const [areCookiesFinalized, setAreCookiesFinalized] = useState(false);

	const cookieCheckedStates: boolean[] = [];
	const setCookieCheckedStates: Dispatch<SetStateAction<boolean>>[] = [];

	// restore the cookie
	const previousCookieSettings: { [key: string]: boolean } =
		getCookie(allowedCookiesCookieName) ?? {};

	// hide it if the previous cookie settings are not empty
	useEffect(() => {
		if (Object.keys(previousCookieSettings).length === 0)
			setIsBannerShown(true);
	}, []);

	cookieTypes.forEach((cookieData) => {
		const preStoredData = previousCookieSettings[cookieData.id];
		const [isActive, setIsActive] = cookieData.isAlwaysActive
			? [true, () => undefined]
			: useState(preStoredData ?? false);
		cookieCheckedStates.push(isActive);
		setCookieCheckedStates.push(setIsActive);
	});

	function rememberAllowedCookies() {
		// TODO: respect the choices
		// remember the accepted cookies in a cookie
		const out: { [key: string]: boolean } = {};
		cookieTypes
			.map((cookieType) => cookieType.id)
			.forEach((id, i) => {
				out[id] = cookieCheckedStates[i];
			});

		document.cookie = `${allowedCookiesCookieName}=${JSON.stringify(out)}`;
	}

	useEffect(() => {
		if (areCookiesFinalized) rememberAllowedCookies();
	}, [areCookiesFinalized]);

	return (
		<>
			<div className={`cookie-banner ${isBannerShown ? "" : "dnone"}`}>
				<div className="content">
					<p>
						By Clicking "Accept All Cookies". you agree to the storing of
						cookies on your device to enhance site navigation, analyse site
						usage, and assist in our marketing effort.
					</p>
					<div className="buttons-cookies">
						<button
							className="accept-cookie"
							onClick={() => {
								setIsBannerShown(false);
								setAll(setCookieCheckedStates, true as boolean);
								setAreCookiesFinalized(true);
							}}
						>
							Accept All Cookies
						</button>
						<button
							className="setting-cookie"
							onClick={() => setIsPopupShown(true)}
						>
							Cookie Settings
						</button>
					</div>
				</div>
				<span className="close-icon" onClick={() => setIsBannerShown(false)}>
					<FontAwesomeIcon icon={faTimes} />
				</span>
			</div>
			<div className={`cookies-pop-up ${isPopupShown ? "dflex" : "dnone"}`}>
				<div className="content">
					<div className="top-area">
						<div className="logo">
							<img src="/img/logo.svg" alt="Our logo" />
						</div>
						<div
							className="close-icon-cookie"
							onClick={() => setIsPopupShown(false)}
						>
							<FontAwesomeIcon icon={faTimes} />
						</div>
					</div>
					<div className="body-content">
						<div className="presentation-area">
							<h3>Cookie Settings</h3>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Aliquid dolores ducimus, eligendi optio, obcaecati nulla
								blanditiis voluptate reprehenderit id veritatis ex tempora
								iusto, accusamus ut! Animi accusamus architecto odio consequatur
								eveniet, quam, sint temporibus, inventore est quis cupiditate
								vel minus quae eius repudiandae soluta. At debitis sed ullam
								quos dolore.
							</p>
							<button
								onClick={() => {
									setAll(setCookieCheckedStates, true as boolean);
									setAreCookiesFinalized(true);
								}}
							>
								Allow All
							</button>
						</div>
						<div className="cookie-preference">
							<h3>Cookie Preference</h3>
							<ul>
								{cookieTypes.map((cookieData, i) => {
									const [showBody, setShowBody] = useState(false);
									return (
										<li key={i}>
											<div className="head">
												<div className="presentation">
													<PlusSign onClick={() => setShowBody(!showBody)} />
													<p>{cookieData.name}</p>
												</div>
												{cookieData.isAlwaysActive ? (
													<p className="active-cookie">Always Active</p>
												) : (
													<>
														<input
															type="checkbox"
															name={`cookie-checkbox-${cookieData.name}`}
															id={`cookie-checkbox-${cookieData.name}`}
															checked={cookieCheckedStates[i]}
															readOnly={true}
															style={{ display: "none" }}
														/>
														<label
															className="checkbox-wrapper"
															htmlFor={`cookie-checkbox-${cookieData.name}`}
															onClick={() =>
																setCookieCheckedStates[i]?.(
																	!cookieCheckedStates[i]
																)
															}
														>
															<span className="ball"></span>
														</label>
													</>
												)}
											</div>
											<div className={`body ${showBody ? "dblock" : "dnone"}`}>
												<p>{cookieData.desc}</p>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					<div
						className="confirm-choice"
						onClick={() => {
							setIsPopupShown(false);
							setIsBannerShown(false);
							setAreCookiesFinalized(true);
						}}
					>
						<button>Confirm my Choices</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default CookieBanner;
