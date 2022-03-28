import { ReactElement, useState } from "react";
import Head from "../client/components/Head";

import OrgNameAndType from "../client/components/OrgNameAndType.jsx";
import OrgBasicInfo from "../client/components/OrgBasicInfo.jsx";
import OrgMission from "../client/components/OrgMission.jsx";
import OrgLogo from "../client/components/OrgLogo.jsx";
import OrgAdminAccount from "../client/components/OrgAdminAccount";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { updateCsrf } from "../server/csrf";
import { csrfFetch } from "../client/utils/csrf";

export type CharitySignupTabType =
	| "orgNameType"
	| "orgBasicInfo"
	| "orgMission"
	| "orgLogo"
	| "orgAdminAccount";

export default function CharitySignup({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState("orgLogo" as CharitySignupTabType);

	const [orgName, setOrgName] = useState("");
	const [orgType, setOrgType] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [postcode, setPostcode] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");

	const [orgDescription, setOrgDescription] = useState("");
	const [orgMission, setOrgMission] = useState("");
	const [isForUnder18, setIsForUnder18] = useState(null as boolean | null);
	const [safeguardingPolicyLink, setSafeguardingPolicyLink] = useState("");
	const [trainingTypeExplanation, setTrainingTypeExplanation] = useState("");
	const [safeguardingLeadName, setSafeguardingLeadName] = useState("");
	const [safeguardingLeadEmail, setSafeguardingLeadEmail] = useState("");

	const [logoFile, setLogoFile] = useState(null as null | File);
	const [facebookLink, setFacebookLink] = useState("");
	const [linkedinLink, setLinkedinLink] = useState("");
	const [twitterLink, setTwitterLink] = useState("");

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
		// const chairtyData = {
		// 	orgName,
		// 	orgType,
		// 	addressLine1,
		// 	addressLine2,
		// 	websiteUrl,
		// 	postcode,
		// 	city,
		// 	phone,

		// 	orgDescription,
		// 	orgMission,
		// 	isForUnder18,
		// 	safeguardingPolicyLink,
		// 	trainingTypeExplanation,
		// 	safeguardingLeadName,
		// 	safeguardingLeadEmail,

		// 	facebookLink,
		// 	linkedinLink,
		// 	twitterLink,

		// 		firstName: adminAccountData.firstName,
		// 		lastName: adminAccountData.lastName,
		// 		password: adminAccountData.password,
		// 		email: adminAccountData.email,
		// };

		const charityData = {
			addressLine1: "address line 1",
			addressLine2: "address line 2",
			email: "admin@admin.co",
			firstName: "Admin name",
			lastName: "Admin surname",
			password: "abcd",
			city: "London",
			facebookLink: "https://face.bo",
			isForUnder18: true,
			linkedinLink: "https://link.in",
			orgDescription: "Organization description",
			orgMission: "Mission statement",
			orgName: "org name",
			orgType: "org type",
			phone: "088",
			postcode: "AB1 2CD",
			safeguardingLeadEmail: "john@safeguarding.co",
			safeguardingLeadName: "John McSafeguarding",
			safeguardingPolicyLink: "https://safeguarding.com",
			trainingTypeExplanation: "Some other training explanation",
			twitterLink: "https://twtr.co",
			websiteUrl: "https://websiteurl.com",
		};

		const formData = new FormData();
		Object.entries(charityData).forEach(([k, v]) => {
			const value = typeof v === "string" ? v : JSON.stringify(v);
			formData.append(k, value);
		}); // also remove the quotes when needed so that a string "abc" does not become "\"abc\""
		formData.append("logoFile", logoFile as File);

		const res = await csrfFetch(csrfToken, `/api/signupOrg`, {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				accept: "application/json",
			},
			body: formData,
		});
		if (res.status >= 400)
			return setRequestErrorMessage(`Error: ${await res.text()}`);

		// router.push(
		// 	`/verifyEmailOrg?email=${encodeURIComponent(
		// 		adminAccountData.email ?? ""
		// 	)}`
		// );
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
								websiteUrl,
								setWebsiteUrl,
							}}
							setActiveTab={setActiveTab}
							setRequestErrorMessage={setRequestErrorMessage}
						/>
					) : activeTab === "orgMission" ? (
						<OrgMission
							setActiveTab={setActiveTab}
							setMissionDescription={setOrgMission}
							setOrganisationDescription={setOrgDescription}
							{...{
								setSafeguardingPolicyLink,
								setIsForUnder18,
								setTrainingTypeExplanation,
								setSafeguardingLeadName,
								setSafeguardingLeadEmail,
							}}
						/>
					) : activeTab === "orgLogo" ? (
						<OrgLogo
							setActiveTab={setActiveTab}
							{...{
								setLogoFile,
								logoFile,
								setFacebookLink,
								setLinkedinLink,
								setTwitterLink,
								facebookLink,
								linkedinLink,
								twitterLink,
							}}
						/>
					) : activeTab === "orgAdminAccount" ? (
						<OrgAdminAccount
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

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
