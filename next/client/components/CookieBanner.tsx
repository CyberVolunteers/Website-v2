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
		desc: "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but most parts of the site might not work because of that.",
		isAlwaysActive: true,
	},
	{
		id: "functional",
		name: "Functional Cookies",
		desc: "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.",
	},
	{
		id: "performance",
		name: "Performance Cookies",
		desc: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.",
	},
	{
		id: "targeting",
		name: "Trageting Cookies",
		desc: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.",
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
		// TODO: if we add such cookies, disable them based on the choices
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
								When you visit any website, it may store or retrieve information
								on your browser, mostly in the form of cookies. This information
								might be about you, your preferences or your device and is
								mostly used to make the site work as you expect it to. The
								information does not usually directly identify you, but it can
								give you a more personalized web experience. Because we respect
								your right to privacy, you can choose not to allow some types of
								cookies. Click on the different category headings to find out
								more and change our default settings. However, blocking some
								types of cookies may impact your experience of the site and the
								services we are able to offer.
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
