import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState, useRef } from "react";

import styles from "../styles/organisationLogo.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { allowedFileTypes } from "../../serverAndClient/staticDetails";
import { generateErrorResetter } from "../../client/utils/misc";
import { addVisitedField, getFieldClasses } from "../../client/utils/formUtils";
import isURL from "validator/lib/isURL";
import { getFileExtension } from "../../serverAndClient/utils";

export default function OrgLogo({
	setActiveTab,
	setLogoFile,
	logoFile,
	setFacebookLink,
	setLinkedinLink,
	setTwitterLink,
	facebookLink,
	linkedinLink,
	twitterLink,
}) {
	const [social, setSocial] = useState(false);

	const [imageErrorMessage, setLogoFileErrorMessage] = useState("");

	const [facebookLinkErrorMessage, setFacebookLinkErrorMessage] = useState("");
	const [linkedinLinkErrorMessage, setLinkedinLinkErrorMessage] = useState("");
	const [twitterLinkErrorMessage, setTwitterLinkErrorMessage] = useState("");

	const [acceptedTerms, setAcceptedTerms] = useState(false);

	const [visitedFields, setVisitedFields] = useState([]);

	function isValidOptionalUrl(url) {
		return url === "" || isURL(url);
	}

	const isValid =
		isValidOptionalUrl(facebookLink) &&
		isValidOptionalUrl(linkedinLink) &&
		isValidOptionalUrl(twitterLink) &&
		logoFile !== null &&
		imageErrorMessage === "" &&
		acceptedTerms;

	return (
		<>
			<p className="create-account-message">Upload your Organisation’s Logo</p>{" "}
			<div className={`${styles.profile_img_area} profile_img_area`}>
				{/* <div className={`${styles.profile_img_pure} profile_img_pure`}>
					<FontAwesomeIcon icon={faFileContract} />
				</div> */}
				<p style={{ color: "#000" }}>
					A good photo helps distinguish your non-profit and generates more
					potential volunteers
				</p>
			</div>
			<div className="button-wrapper width_100_button">
				<Button variant="contained" color="primary" style={{ padding: "0px" }}>
					<label
						htmlFor="file_upload"
						style={{
							display: "block",
							width: "100%",
							height: "100%",
							cursor: "pointer",
						}}
					>
						UPLOAD
					</label>
					<input
						onChange={(e) => {
							const element = e.target;
							const file = element?.files?.[0];
							const fileExt = getFileExtension(file.name);

							if (!allowedFileTypes.includes(fileExt)) {
								const allowedFileTypesCopy = [...allowedFileTypes];
								const lastAllowedFileType = allowedFileTypesCopy.pop();

								const allowedFileExtString = `${allowedFileTypesCopy.join(
									", "
								)} or a ${lastAllowedFileType}`;
								setLogoFileErrorMessage(
									`Unfortunately, we can not process ${fileExt} files. Please use a ${allowedFileExtString} file.`
								);
								setLogoFile(null);
								return;
							}

							setLogoFileErrorMessage("");
							setLogoFile(file);
						}}
						type="file"
						name=""
						id="file_upload"
						style={{ display: "none" }}
					/>
				</Button>
			</div>
			<span
				className="helping-text password-helper"
				style={{
					marginBottom: "0px",
					paddingLeft: "3px",
					display: imageErrorMessage === "" ? "none" : undefined,
				}}
			>
				{imageErrorMessage}
			</span>
			<div
				className={`${styles.organization_logo_desc} organization_logo_desc`}
				style={{ marginTop: "1rem" }}
			>
				<p style={{ fontSize: 15, color: "#666666" }}>
					Do you wish to add links to your organisations social media account?
				</p>
				<div className={`${styles.desc_wrapper} desc_wrapper`}>
					<div
						className="checkbox-wrapper password-checkbox-wrapper"
						style={{ marginBottom: 20 }}
					>
						<input
							type="radio"
							onClick={(e) => {
								setSocial(true);
							}}
							name="selection"
							id="yes-selection-checkbox"
							style={{ display: "none" }}
						/>
						<label
							htmlFor="yes-selection-checkbox"
							id="forget-password-wrapper"
						>
							<label
								htmlFor="yes-selection-checkbox"
								className="custom-checkbox custom-checkbox-box show-password-label"
							>
								<FontAwesomeIcon icon={faCheck} />
							</label>
							<p>Yes</p>
						</label>
					</div>
					<div
						className="checkbox-wrapper password-checkbox-wrapper"
						style={{ marginBottom: 20 }}
					>
						<input
							type="radio"
							name="selection"
							id="no-selection-checkbox"
							onClick={(e) => {
								setSocial(false);

								setFacebookLink("");
								setLinkedinLink("");
								setTwitterLink("");

								setFacebookLinkErrorMessage("");
								setLinkedinLinkErrorMessage("");
								setTwitterLinkErrorMessage("");
							}}
							style={{ display: "none" }}
						/>
						<label htmlFor="no-selection-checkbox" id="forget-No-wrapper">
							<label
								htmlFor="no-selection-checkbox"
								className="custom-checkbox custom-checkbox-box show-password-label"
							>
								<FontAwesomeIcon icon={faCheck} />
							</label>
							<p>No</p>
						</label>
					</div>
				</div>
			</div>
			<div className="input-collection" style={{ marginTop: ".5rem" }}>
				{social === false ? null : (
					<>
						<TextField
							className={`facebook ${getFieldClasses(
								"facebook",
								visitedFields
							)}`}
							onFocus={generateErrorResetter(setFacebookLinkErrorMessage)}
							onBlur={(e) => {
								addVisitedField("facebook", visitedFields, setVisitedFields);

								if (facebookLink !== "" && !isURL(facebookLink))
									setFacebookLinkErrorMessage("Invalid link");
							}}
							onChange={(e) => {
								setFacebookLink(e.target.value);
							}}
							id="facebook"
							label="Facebook URL"
							autoComplete="on"
							variant="outlined"
							style={{ width: "100%" }}
						/>
						<span
							className="helping-text text-helper"
							style={{
								marginBottom: 10,
								display: "inline-block",
								marginTop: 7,
								fontSize: 13,
								paddingLeft: 12,
								color: "#F65B4E",
							}}
						>
							{facebookLinkErrorMessage}
						</span>

						<TextField
							className={`linkedin ${getFieldClasses(
								"linkedin",
								visitedFields
							)}`}
							onFocus={generateErrorResetter(setLinkedinLinkErrorMessage)}
							onBlur={(e) => {
								addVisitedField("linkedin", visitedFields, setVisitedFields);

								if (linkedinLink !== "" && !isURL(linkedinLink))
									setLinkedinLinkErrorMessage("Invalid link");
							}}
							onChange={(e) => {
								setLinkedinLink(e.target.value);
							}}
							id="linkedin"
							label="Linkdin URL"
							autoComplete="on"
							variant="outlined"
							style={{ width: "100%" }}
						/>
						<span
							className="helping-text text-helper"
							style={{
								marginBottom: 10,
								display: "inline-block",
								marginTop: 7,
								fontSize: 13,
								paddingLeft: 12,
								color: "#F65B4E",
							}}
						>
							{linkedinLinkErrorMessage}
						</span>

						<TextField
							className={`twitter ${getFieldClasses("twitter", visitedFields)}`}
							onFocus={generateErrorResetter(setTwitterLinkErrorMessage)}
							onBlur={(e) => {
								addVisitedField("twitter", visitedFields, setVisitedFields);

								if (twitterLink !== "" && !isURL(twitterLink))
									setTwitterLinkErrorMessage("Invalid link");
							}}
							onChange={(e) => {
								setTwitterLink(e.target.value);
							}}
							id="twitter"
							label="Twitter URL"
							autoComplete="on"
							variant="outlined"
							style={{ width: "100%" }}
						/>
						<span
							className="helping-text text-helper"
							style={{
								marginBottom: 10,
								display: "inline-block",
								marginTop: 7,
								fontSize: 13,
								paddingLeft: 12,
								color: "#F65B4E",
							}}
						>
							{twitterLinkErrorMessage}
						</span>
					</>
				)}

				<div
					className="checkbox-wrapper password-checkbox-wrapper"
					style={{ marginBottom: 27 }}
				>
					<input
						type="checkbox"
						name="aggreement"
						id="aggreement"
						onClick={(e) => {
							setAcceptedTerms(!acceptedTerms);
						}}
						style={{ display: "none" }}
					/>
					<label htmlFor="aggreement">
						<label
							htmlFor="aggreement"
							className="custom-checkbox custom-checkbox-box show-password-label"
							style={{ minWidth: 20 }}
						>
							<FontAwesomeIcon icon={faCheck} />
						</label>
						<p
							style={{
								fontSize: 13,
								color: "rgb(116, 112, 113)",
								fontWeight: 600,
							}}
						>
							{" "}
							By creating an account you agree that you've read and agree with
							the{" "}
							<Link
								href="/downloads/termsOfUse.docx"
								style={{
									color: "#000",
								}}
							>
								terms of service
							</Link>{" "}
							and{" "}
							<Link
								href="/downloads/privacyPolicy.docx"
								style={{
									color: "#000",
								}}
							>
								privacy policy
							</Link>
						</p>
					</label>
				</div>

				<div className="button-wrapper width_100_button">
					<Button
						variant="contained"
						color="primary"
						id="create-account-button"
						className={isValid ? "" : "disable"}
						onClick={() => {
							setActiveTab("orgAdminAccount");
						}}
					>
						CREATE YOUR ACCOUNT
					</Button>
				</div>
			</div>
		</>
	);
}
