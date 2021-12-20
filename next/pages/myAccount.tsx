import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "../client/components/Head";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";

import { LocalHeader } from "../client/components/LocalHeader";
import { localHeaderItems } from "../client/utils/const";

import { HelperMessage } from "../client/components/HelperMessage";
import { PersonalInfoSection } from "../client/components/PersonalInfoSection";
import { Volunteer } from "../client/components/Volunteer";
import { SignOut } from "../client/components/SignOut";

import { BasicInfo } from "../client/components/BasicInfo";
import { SkillsAndInterests } from "../client/components/SkillsAndInterests";
import { Email } from "../client/components/Email";
import { Password } from "../client/components/Password";

import { VolunteerCause } from "../client/components/VolunteerCause";

import Button from "../client/components/Button";

import generalAccountStyles from "../client/styles/generalAccount.module.css";
import personalInformationStyles from "../client/styles/personalInformation.module.css";
import volunteeringStatsStyles from "../client/styles/volunteeringStats.module.css";

import { MouseEventHandler, ReactElement, useState } from "react";
import { getUserType, UserClient } from "../server/auth/data";
import { useIsAfterRehydration } from "../client/utils/otherHooks";

export default function MyAccount({
	accountData,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	// TODO: technically, since we get the fields from the server, view protection isn't needed

	// useViewProtection(["org", "user"]);

	// const userType = useViewerType();
	// const isOrg = getAccountInfo()?.isOrg;

	const isAfterRehydration = useIsAfterRehydration();

	const [activeSection, setActiveSection] = useState(
		"General" as "General" | "Personal Information" | "Volunteering Stats"
	);

	const [personalInfoActive, setPersonalInfoActive] =
		useState("basic_info_link");
	const HandlePersonalInfoLink: MouseEventHandler<HTMLAnchorElement> = (e) => {
		const targetId = (e.target as any).id;
		targetId == "basic_info_link" && setPersonalInfoActive("basic_info_link");
		targetId == "Skills_link" && setPersonalInfoActive("Skills_link");
		targetId == "Email_link" && setPersonalInfoActive("Email_link");
		targetId == "Password_link" && setPersonalInfoActive("Password_link");
	};

	// TODO: fail if the account data is not found
	let shownSection: JSX.Element | null = null;
	if (isAfterRehydration && accountData !== null) {
		shownSection =
			activeSection === "General" ? (
				<div className={generalAccountStyles._container}>
					<h1 className={generalAccountStyles.main_heading}>
						Welcome Atif Asim
					</h1>
					{accountData.isEmailVerified ? null : (
						<HelperMessage email={accountData.email} />
					)}
					<Volunteer />
					<PersonalInfoSection data={accountData} />
					<SignOut />
				</div>
			) : activeSection === "Personal Information" ? (
				<div className={generalAccountStyles._container}>
					<nav className={personalInformationStyles.sidebar_nav}>
						<li>
							<a
								href="#basic_info"
								className={`${
									personalInfoActive == "basic_info_link" &&
									personalInformationStyles.active
								}`}
								id="basic_info_link"
								onClick={HandlePersonalInfoLink}
							>
								Basic Info
							</a>
						</li>{" "}
						<li>
							<a
								href="#Skills"
								id="Skills_link"
								onClick={HandlePersonalInfoLink}
								className={`${
									personalInfoActive == "Skills_link" &&
									personalInformationStyles.active
								}`}
							>
								Your Skills and Interests
							</a>
						</li>{" "}
						<li>
							<a
								href="#Email"
								id="Email_link"
								onClick={(e) => HandlePersonalInfoLink}
								className={`${
									personalInfoActive == "Email_link" &&
									personalInformationStyles.active
								}`}
							>
								Email
							</a>
						</li>{" "}
						<li>
							<a
								href="#Password"
								id="Password_link"
								onClick={HandlePersonalInfoLink}
								className={`${
									personalInfoActive == "Password_link" &&
									personalInformationStyles.active
								}`}
							>
								Password
							</a>
						</li>
					</nav>
					<div className={personalInformationStyles.top_area}>
						<h1
							className={`${generalAccountStyles.main_heading} ${personalInformationStyles.main_heading}`}
						>
							Personal Information
						</h1>
						<p className={personalInformationStyles.first_para}>
							You are missing information in the following sections:{" "}
							<a href="#">Basic info,</a> <a href="#">Your Skills</a>{" "}
							<a href="#">Interests.</a>
						</p>
					</div>

					<BasicInfo data={accountData} />
					<SkillsAndInterests />
					<Email />
					<Password />
				</div>
			) : activeSection === "Volunteering Stats" ? (
				<div className={generalAccountStyles._container}>
					<h1
						className={`${generalAccountStyles.main_heading} ${volunteeringStatsStyles.main_heading}`}
					>
						Welcome Atif Asim
					</h1>

					<p className={volunteeringStatsStyles.first_para}>
						You have volunteered <b>3</b> times.
					</p>

					<VolunteerCause />

					<div className={volunteeringStatsStyles.last_wrapper}>
						<p className={volunteeringStatsStyles.last_para}>
							You have volunteered for <b>2</b> charities.
						</p>

						<Button style={{ width: 210, fontSize: "16px", marginTop: 20 }}>
							Find an opportunity
						</Button>
					</div>
				</div>
			) : null;
	}

	return (
		<>
			<Head title="My account - cybervolunteers" />
			<LocalHeader
				list={localHeaderItems}
				active={activeSection}
				setActiveSection={setActiveSection}
			/>
			{/* TODO: show an error message if not showing anything here, i.e. there was no data sent */}
			{shownSection}
		</>
	);

	// TODO: a button to change the password
}

export const getServerSideProps: GetServerSideProps<{
	accountData: UserClient | null;
}> = async (context: any) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	if (typeof session !== "object" || session === null)
		return {
			props: {
				accountData: null,
			},
		};
	const { isUser, isVerifiedUser } = getUserType(session);

	// copy things over
	const accountData: UserClient = {
		firstName: session.firstName,
		lastName: session.lastName,
		city: session.city,
		email: session.email,
		adminLevel: session.adminLevel,
		birthDate: session.birthDate,
		address1: session.address1,

		postcode: session.postcode,

		isEmailVerified: session.isEmailVerified,

		// isVerified: isVerifiedUser,
		isOrg: false,
	};

	// let fields: AccountDataType = {};

	// if (isLoggedIn(session)) {
	// 	const isRequestByAnOrg = isVerifiedOrg(session);
	// 	fieldNames = isRequestByAnOrg ? orgFieldNamesToShow : userFieldNamesToShow;

	// 	editableFields = isRequestByAnOrg
	// 		? flatten(orgDataUpdateSpec)
	// 		: flatten(userDataUpdateSpec);

	// 	allFields = isRequestByAnOrg ? flatten(organisations) : flatten(users);

	// 	delete allFields.password;

	// 	fields = Object.fromEntries(
	// 		Object.entries(session).filter(([k, v]) => k in allFields)
	// 	); // only show the ones which were selected
	// }

	// TODO: clean it and leave only the required fields - for security!

	return {
		props: {
			accountData,
		}, // will be passed to the page component as props
	};
};
