import { useState } from "react";
import Head from "../client/components/Head";

import OrgNameAndType from "../client/components/OrgNameAndType.jsx";
import OrgBasicInfo from "../client/components/OrgBasicInfo.jsx";
import OrgMission from "../client/components/OrgMission.jsx";
import OrgLogo from "../client/components/OrgLogo.jsx";
import OrgAdminAccount from "../client/components/OrgAdminAccount";
import { useRouter } from "next/router";

export type CharitySignupTabType =
	| "orgNameType"
	| "orgBasicInfo"
	| "orgMission"
	| "orgLogo"
	| "orgAdminAccount";

export default function CharitySignup() {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState(
		"orgNameType" as CharitySignupTabType
	);

	const [orgName, setOrgName] = useState("");
	const [orgType, setOrgType] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [postcode, setPostcode] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");

	const [adminAccountData, setAdminAccountData] = useState(
		{} as {
			firstName: string;
			lastName: string;
			password: string;
			password2: string;
			email: string;
		}
	);

	const [requestErrorMessage, setRequestErrorMessage] = useState("");

	const submit = async () => {
		router.push(
			`/verifyEmailOrg?email=${encodeURIComponent(
				adminAccountData.email ?? ""
			)}`
		);
	};

	return (
		<div className="SignUp" style={{ fontWeight: "bold" }}>
			<div className="body-area">
				<form action="" className="outer-form">
					<Head title="Create an organisation - cybervolunteers" />
					{activeTab === "orgNameType" ? (
						<OrgNameAndType
							{...{ orgName, setOrgName, orgType, setOrgType }}
							setActiveTab={setActiveTab}
						/>
					) : activeTab === "orgBasicInfo" ? (
						<OrgBasicInfo
							{...{
								addressLine1,
								addressLine2,
								setAddressLine1,
								setAddressLine2,
								setPostcode,
								setCity,
								postcode,
								city,
								phone,
								setPhone,
							}}
							setActiveTab={setActiveTab}
							setRequestErrorMessage={setRequestErrorMessage}
						/>
					) : activeTab === "orgMission" ? (
						<OrgMission setActiveTab={setActiveTab} />
					) : activeTab === "orgLogo" ? (
						<OrgLogo setActiveTab={setActiveTab} />
					) : activeTab === "orgAdminAccount" ? (
						<OrgAdminAccount
							data={adminAccountData}
							setData={setAdminAccountData}
							submit={submit}
							setRequestErrorMessage={setRequestErrorMessage}
						/>
					) : null}
					{requestErrorMessage === "" ? null : (
						<span
							className="helping-text password-helper"
							style={{ marginBottom: "0px", paddingLeft: "3px" }}
						>
							{requestErrorMessage}
						</span>
					)}
				</form>
			</div>
		</div>
	);
}
