import { addVisitedField, getFieldClasses } from "../utils/formUtils";
import { cleanPostcode, generateErrorResetter, wait } from "../utils/misc";

import TextField from "@material-ui/core/TextField";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { postcodeRE } from "../utils/const";

export default function AddressInput({
	addressLine1,
	addressLine2,
	setAddressLine1,
	setAddressLine2,
	postcode,
	setPostcode,
	city,
	setCity,
	setRequestErrorMessage,
	setIsDataValid,
}: {
	addressLine1: string;
	addressLine2: string;
	postcode: string;
	city: string;
	setAddressLine1: React.Dispatch<React.SetStateAction<string>>;
	setAddressLine2: React.Dispatch<React.SetStateAction<string>>;
	setCity: React.Dispatch<React.SetStateAction<string>>;
	setPostcode: React.Dispatch<React.SetStateAction<string>>;
	setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
	setIsDataValid: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [isSimpleAddressInputShown, setIsSimpleAddressInputShown] =
		useState(true);

	const [addressLine1ErrorMessage, setAddressLine1ErrorMessage] = useState("");
	const [postcodeErrorMessage, setPostcodeErrorMessage] = useState("");
	const [cityErrorMessage, setCityErrorMessage] = useState("");

	const [visitedFields, setVisitedFields] = useState([] as string[]);

	const isValid =
		addressLine1 !== "" &&
		postcode !== "" &&
		city !== "" &&
		addressLine1ErrorMessage === "" &&
		postcodeErrorMessage === "" &&
		cityErrorMessage === "" &&
		postcodeRE.test(cleanPostcode(postcode));

	useEffect(() => {
		setIsDataValid(isValid);
	}, [
		addressLine1,
		addressLine2,
		postcode,
		city,
		addressLine1ErrorMessage,
		postcodeErrorMessage,
		cityErrorMessage,
	]);

	return (
		<div className="full-address-container">
			{isSimpleAddressInputShown ? (
				<>
					<AddressMenu
						{...{
							setAddressLine1,
							setPostcode,
							setIsSimpleAddressInputShown,
							setCity,
							setRequestErrorMessage,
						}}
					/>
					<div
						className="layout"
						style={{
							height: "15px",
						}}
					></div>
				</>
			) : (
				<>
					<div className="expand-address" style={{ marginTop: 20 }}>
						<div className="text-field-wrapper">
							<TextField
								className={`address ${getFieldClasses(
									"addressLine1",
									visitedFields
								)}`}
								id="address1"
								label="Address Line 1"
								variant="outlined"
								style={{ width: "100%" }}
								type="text"
								value={addressLine1}
								error={addressLine1ErrorMessage !== ""}
								onChange={(e) => setAddressLine1(e.target.value)}
								onBlur={(e) => {
									addVisitedField(
										"addressLine1",
										visitedFields,
										setVisitedFields
									);
									if (e.target.value === "")
										setAddressLine1ErrorMessage("Please enter an address");
								}}
								onFocus={generateErrorResetter(setAddressLine1ErrorMessage)}
							/>
							<span className="helping-text address-line-1">
								{addressLine1ErrorMessage}
							</span>
						</div>

						<div className="text-field-wrapper">
							<TextField
								className={`address ${getFieldClasses(
									"addressLine2",
									visitedFields
								)}`}
								id="address2"
								label="Address Line 2 (optional)"
								variant="outlined"
								style={{ width: "100%" }}
								type="text"
								value={addressLine2}
								onChange={(e) => setAddressLine2(e.target.value)}
								onBlur={(e) => {
									addVisitedField(
										"addressLine2",
										visitedFields,
										setVisitedFields
									);
								}}
							/>
						</div>

						<span className="helping-text layout"></span>
						<div className="postcode-city-container">
							<div className="text-field-wrapper half-width">
								<TextField
									className={`postcode ${getFieldClasses(
										"postcode",
										visitedFields
									)}`}
									id="postcode"
									label="Postcode"
									variant="outlined"
									type="text"
									value={postcode}
									error={postcodeErrorMessage !== ""}
									onChange={(e) => setPostcode(e.target.value)}
									onBlur={(e) => {
										addVisitedField(
											"postcode",
											visitedFields,
											setVisitedFields
										);
										if (!postcodeRE.test(cleanPostcode(e.target.value)))
											setPostcodeErrorMessage("Please enter a valid postcode");
									}}
									onFocus={generateErrorResetter(setPostcodeErrorMessage)}
								/>
								<div className="helping-text postcode-helper">
									{postcodeErrorMessage}
								</div>
							</div>
							<div className="text-field-wrapper half-width">
								<TextField
									className={`town ${getFieldClasses("town", visitedFields)}`}
									id="town"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									error={cityErrorMessage !== ""}
									label="Town/City"
									variant="outlined"
									type="text"
									onBlur={(e) => {
										addVisitedField("town", visitedFields, setVisitedFields);
										if (e.target.value === "")
											setCityErrorMessage("Please enter a town/city");
									}}
									onFocus={generateErrorResetter(setCityErrorMessage)}
								/>
								<div className="helping-text postcode-helper">
									{cityErrorMessage}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

const minSearchCooldownMillis = 500;

function AddressMenu({
	setIsSimpleAddressInputShown,
	setPostcode,
	setAddressLine1,
	setCity,
	setRequestErrorMessage,
}: {
	setIsSimpleAddressInputShown: React.Dispatch<React.SetStateAction<boolean>>;
	setPostcode: React.Dispatch<React.SetStateAction<string>>;
	setAddressLine1: React.Dispatch<React.SetStateAction<string>>;
	setCity: React.Dispatch<React.SetStateAction<string>>;
	setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [addressStageNum, setAddressStageNum] = useState(0);

	// the "raw" address is the address that is then used for suggestions
	const [rawAddress, setRawAddress] = useState("");
	const [visitedFields, setVisitedFields] = useState([] as string[]);

	// TODO: fetch results: create a server-side api, fetch the actual api from there and then double-check the postcode on submit. store as postcode + address in db + cache - no transitive deps please
	let [addressSuggestions, setAddressSuggestions] = useState(
		[] as (
			| { postcode: string; city: string; address: string; place_id: string }
			| {
					postcode: string;
					city: string;
					address: string[];
					place_id: string;
					shortDesc: string;
			  }
		)[]
	);

	async function updateAddressSuggestions() {
		const thisUpdatorId = Math.random();
		window.lastAddressSuggestionsUpdatorId = thisUpdatorId;

		if (addressStageNum !== 0) return setAddressSuggestions([]);
		if (rawAddress.length <= 3) return setAddressSuggestions([]);

		await wait(minSearchCooldownMillis);
		// if there have been no more requests, proceed
		if (window.lastAddressSuggestionsUpdatorId !== thisUpdatorId) return;

		try {
			const results: {
				description: string;
				place_id: string;
				structured_formatting: {
					secondary_text: string;
				};
			}[] = await getPlaceIdentifierSuggestions(rawAddress);

			const newSuggestions = results.map((el) => {
				const descriptionParts = el.description.split(",");
				return {
					postcode: "",
					address: el.description,
					city: (
						descriptionParts[descriptionParts.length - 2] ??
						el.structured_formatting.secondary_text
					).trim(),
					place_id: el.place_id,
				};
			});

			setAddressSuggestions(newSuggestions);
		} catch {
			return setRequestErrorMessage(
				"Something went wrong when getting address suggestions. Please enter them manually."
			);
		}
	}

	const showAddressSuggestions = rawAddress.length > 0;
	const [isInFocus, setIsInFocus] = useState(false);

	useEffect(() => {
		updateAddressSuggestions();
	}, [rawAddress]);

	// ref to see if the element is clicked
	const thisRef = useRef<HTMLDivElement>(null);

	function onClickOutside(e: MouseEvent) {
		if (!thisRef.current) return;
		setIsInFocus(thisRef.current.contains(e.target as Node));
	}

	// wait for clicks outside
	useEffect(() => {
		document.addEventListener("click", onClickOutside, true);
		return () => {
			document.removeEventListener("click", onClickOutside, true);
		};
	}, []);

	const showRawAddressError =
		visitedFields.includes("rawAddress") && !isInFocus && rawAddress === "";

	return (
		<div ref={thisRef}>
			<div
				// autoComplete="off"
				style={{
					position: "relative",
					backgroundColor: "transparent",
					width: "100%",
					border: "none",
					padding: 0,
				}}
				className="address-wrapper"
			>
				<TextField
					className={`address ${
						isInFocus ? "expanded-address-input-field" : ""
					} ${getFieldClasses("rawAddress", visitedFields)}`}
					id="address"
					autoComplete="off"
					label="Enter your address"
					variant="outlined"
					style={{ width: "100%", marginTop: 20 }}
					type="text"
					value={rawAddress}
					error={showRawAddressError}
					// not onFocus to avoid flashes of the error message
					onBlur={() => {
						addVisitedField("rawAddress", visitedFields, setVisitedFields);
					}}
					onChange={(e) => {
						// invalidate the current option
						setAddressStageNum(0);
						setAddressSuggestions([]);
						setRawAddress(e.target.value);
					}}
				/>
				{showRawAddressError ? (
					<small
						style={{
							display: "block",
							marginTop: "7px",
							fontSize: "13px",
							color: "rgb(246, 91, 78)",
						}}
						className="address-error"
					>
						{/* Invalid postcode */}
						Invalid Address
					</small>
				) : null}
				{isInFocus ? null : (
					<small
						style={{
							fontSize: "12px",
							color: " rgb(127, 122, 123)",
							width: "100%",
							left: "0%",
						}}
						className="available-message"
					>
						Cyber Volunteers is only available in the UK
					</small>
				)}
			</div>

			{!isInFocus ? null : (
				<div
					data-worthless-attr="a"
					className="result-wrapper"
					style={{
						position: "relative",
						zIndex: 2,
						backgroundColor: "#fff",
					}}
				>
					{!showAddressSuggestions ? (
						<p>
							e.g. “1 Gristhorpe Road” {/*“SW12 7EU” or “L26 5QA”*/}or “64
							London Road”
						</p>
					) : (
						<div className="typing-start-result">
							<div className="firstpart">
								{addressSuggestions.map((suggestion, i) => (
									<div
										className="row"
										key={i}
										onMouseDown={() => {
											// if a collection, enter the second stage
											if (Array.isArray(suggestion.address)) {
												// set the next stage
												setAddressStageNum(addressStageNum + 1);
												// expand
												const oldSuggestions = suggestion as {
													postcode: string;
													address: string[];
													city: string;
													shortDesc: string;
													place_id: string;
												};
												const newSuggestions = oldSuggestions.address.map(
													(a) => ({
														postcode: oldSuggestions.postcode,
														address: a,
														city: oldSuggestions.city,
														place_id: oldSuggestions.place_id,
													})
												);
												setAddressSuggestions(newSuggestions);
											} else {
												// select that option
												setAddressLine1(suggestion.address);
												// fetch the postcode
												(async function () {
													const res = await fetch(`/api/getPostcode`, {
														method: "POST",
														body: JSON.stringify({
															place_id: suggestion.place_id,
														}),
													});
													if (res.status >= 400)
														return setRequestErrorMessage(
															"Something went wrong when getting a postcode. Please enter it manually."
														);
													const newPostcode = (await res.json()).results ?? "";
													setPostcode(newPostcode);
												})();
												// setPostcode(suggestion.postcode);

												setCity(suggestion.city);

												// close that popup
												setIsSimpleAddressInputShown(false);
											}
										}}
									>
										<div className="left-presentation">
											<h5>
												{"shortDesc" in suggestion
													? suggestion.shortDesc
													: suggestion.address}
											</h5>
											<small>{suggestion.postcode}</small>
										</div>
										{Array.isArray(suggestion.address) ? (
											<p>{suggestion.address.length} results</p>
										) : null}
									</div>
								))}

								<span
									className="powered-by-google-container"
									style={{
										display: "block",
										color: "#F85220",
										fontSize: "15px",
										textAlign: "center",
										borderTop: "1px solid #ddd",
										padding: "5px 0px",
									}}
								>
									<div
										className="powered-by-google"
										style={{
											marginTop: "4px", // to make it appear vertically centered
											marginLeft: "3px",
										}}
									>
										<Image
											src="/img/powered_by_google_on_white.png"
											alt="powered by google"
											width="112"
											height="14"
										></Image>
									</div>
								</span>

								<span
									className="manual-address"
									style={{
										display: "block",
										color: "#F85220",
										fontSize: "15px",
										textAlign: "center",
										borderTop: "1px solid #ddd",
										padding: "10px 0px",
										cursor: "pointer",
									}}
									// Because onClick does not fire for a couple milliseconds and the element gets deleted
									onMouseDown={() => setIsSimpleAddressInputShown(false)}
								>
									Enter address manually
								</span>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

async function getPlaceIdentifierSuggestions(
	placeIdentifierFragment: string
): Promise<[]> {
	// get more information on those postcodes
	const res = await fetch(`/api/getAddressSuggestions`, {
		method: "POST",
		body: JSON.stringify({
			query: placeIdentifierFragment,
		}),
	});

	if (res.status >= 400) throw new Error();

	return (await res.json()).results;
}
