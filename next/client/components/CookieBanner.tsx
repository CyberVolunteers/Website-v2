// import styles from "../styles/card.module.css";

import { Dispatch, SetStateAction, useState } from "react";

const cookiesData = [
	{
		name: "Strictly necessory Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
		isAlwaysActive: true,
	},
	{
		name: "Functional Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
	},
	{
		name: "Performance Cookies",
		desc: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Architecto blanditiis amet explicabo tenetur, natus
											consequatur repellendus maxime deleniti ex laboriosam.`,
	},
	{
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
	const [isBannerShown, setIsBannerShown] = useState(true);
	const [isPopupShown, setIsPopupShown] = useState(false);

	const cookieCheckedStates: boolean[] = [];
	const setCookieCheckedStates: Dispatch<SetStateAction<boolean>>[] = [];

	cookiesData.forEach((cookieData) => {
		const [isActive, setIsActive] = cookieData.isAlwaysActive
			? [true, () => undefined]
			: useState(false);
		cookieCheckedStates.push(isActive);
		setCookieCheckedStates.push(setIsActive);
	});

	console.log(cookieCheckedStates);

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
					<i className="fas fa-times"></i>
				</span>
			</div>
			<div className={`cookies-pop-up ${isPopupShown ? "dflex" : "dnone"}`}>
				<div className="content">
					<div className="top-area">
						<div
							className="close-icon-cookie"
							onClick={() => setIsPopupShown(false)}
						>
							<i className="fas fa-times"></i>
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
								onClick={() => setAll(setCookieCheckedStates, true as boolean)}
							>
								Allow All
							</button>
						</div>
						<div className="cookie-preference">
							<h3>Cookie Preference</h3>
							<ul>
								{cookiesData.map((cookieData, i) => {
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
