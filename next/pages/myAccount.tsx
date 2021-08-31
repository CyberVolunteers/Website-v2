import Link from "next/link";
import { ReactElement, useState } from "react";
import {
	useIsAfterRehydration,
	useViewProtection,
} from "../client/utils/otherHooks";
import {
	getAccountInfo,
	updateLoginState,
	useViewerType,
} from "../client/utils/userState";
import Head from "../client/components/Head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { isLoggedIn, isOrg } from "../server/auth/data";
import {
	orgFieldNamesToShow,
	userFieldNamesToShow,
} from "../serverAndClient/displayNames";
import { flatten, Flattened } from "combined-validator";
import {
	orgDataUpdateSpec,
	userDataUpdateSpec,
	users,
	organisations,
} from "../serverAndClient/publicFieldConstants";
import React from "react";
import EditableField from "../client/components/EditableField";
import { getSignupPerElementValidationCallbacks } from "../client/components/Signup";
import { updateCsrf } from "../server/csrf";
import { csrfFetch } from "../client/utils/csrf";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { CircularProgress } from "@material-ui/core";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";

export function createEmailChangingFunction(
	overallErrors: { [key: string]: any },
	setOverallErrors: React.Dispatch<
		React.SetStateAction<{
			[key: string]: any;
		}>
	>,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	csrfToken: string
) {
	return async function (name: string, value: any) {
		setIsLoading(true);

		const res = await csrfFetch(csrfToken, "/api/changeEmail", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({ email: value }),
		});

		if (
			!(await updateOverallErrorsForRequests(
				res,
				"changeEmail",
				overallErrors,
				setOverallErrors
			))
		)
			return setIsLoading(false);

		setIsLoading(false);

		// refresh login status
		updateLoginState();

		// the component will update and hit the viewer type protection screen
	};
}

export default function MyAccount({
	accountData: initAccountData,
	editableFields,
	fieldNames,
	csrfToken,
	allFields,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user"]);

	const [isLoading, setIsLoading] = useState(false);
	const [fields, setFields] = useState(initAccountData);

	const [overallErrors, setOverallErrors] = useState(
		{} as { [key: string]: any }
	);

	const changeEmail = createEmailChangingFunction(
		overallErrors,
		setOverallErrors,
		setIsLoading,
		csrfToken
	);

	const isOrg = getAccountInfo()?.isOrg;

	const userType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();

	async function sendEditRequest(k: string, v: any) {
		const url = `/api/update${isOrg ? "Org" : "User"}Data`;
		const data = {} as { [key: string]: any };
		data[k] = v;

		setIsLoading(true);

		const res = await csrfFetch(csrfToken, url, {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(data),
		});

		if (
			!(await updateOverallErrorsForRequests(
				res,
				"myAccountUpdateData",
				overallErrors,
				setOverallErrors
			))
		)
			return setIsLoading(false);

		setIsLoading(false);

		// set the new value through a copy
		const fieldsCopy = Object.assign({}, fields);
		fieldsCopy[k] = v;
		setFields(fieldsCopy);
	}

	const perElementValidationCallbacks: PerElementValidatorCallbacks =
		getSignupPerElementValidationCallbacks(overallErrors, setOverallErrors, {
			allowedEmailAddresses: [fields.email],
		});

	return (
		<div>
			<Head title="My account - cybervolunteers" />

			<p>Hello and welcome to my secure website</p>

			{Object.entries(overallErrors).map(([k, v]) => (
				<h1 key={k}>{v}</h1>
			))}

			{/* Render common stuff normally */}
			{Object.entries(allFields ?? {}).map(([k, fieldDescription]) => {
				const v = k in fields ? fields[k] : null;
				return (
					<EditableField
						key={k}
						name={k}
						value={v}
						presentableNames={fieldNames}
						editableFields={editableFields}
						sendEditRequest={k === "email" ? changeEmail : sendEditRequest} //TODO: a popup saying that it will force you to re-confirm the email
						perElementValidationCallbacks={perElementValidationCallbacks}
					></EditableField>
				);
			})}

			{isLoading ? <CircularProgress /> : null}

			{(() => {
				//only render the stuff that differs on client-side to not run into issues with rehydration: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
				if (!isAfterRehydration) return null;

				switch (userType) {
					case "org":
						return (
							<div>
								<Link href="/manageListings" passHref>
									<a>
										<p>Manage listings</p>
									</a>
								</Link>
							</div>
						);
					case "user":
						return (
							<div>
								<Link href="/searchListings" passHref>
									<a>
										<p>Find new listings</p>
									</a>
								</Link>
							</div>
						);
					default:
						return <p>Please log in to view this</p>;
				}
			})()}

			{/* Etc */}

			<Link href="/changePassword" passHref>
				<a>
					<p>Change my password</p>
				</a>
			</Link>
			<Link href="/logout" passHref>
				<a>
					<p>Log out</p>
				</a>
			</Link>
		</div>
	);

	// TODO: a button to change the password
}

type AccountDataType = {
	[key: string]: any;
};

export const getServerSideProps: GetServerSideProps<{
	accountData: AccountDataType;
	editableFields: Flattened;
	allFields: Flattened;
	fieldNames: { [key: string]: string };
	csrfToken: string;
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	let fields: AccountDataType = {};
	let editableFields: Flattened = {};
	let allFields: Flattened = {};
	let fieldNames: { [key: string]: string } = {};
	if (isLoggedIn(session)) {
		const isRequestByAnOrg = isOrg(session);
		fieldNames = isRequestByAnOrg ? orgFieldNamesToShow : userFieldNamesToShow;

		editableFields = isRequestByAnOrg
			? flatten(orgDataUpdateSpec)
			: flatten(userDataUpdateSpec);

		allFields = isRequestByAnOrg ? flatten(organisations) : flatten(users);

		delete allFields.password;

		const fieldKeys = Object.keys(fieldNames).filter((k) => k in session); // only show the keys that have been specified
		fields = Object.fromEntries(fieldKeys.map((k) => [k, session[k]])); // translate them
	}

	return {
		props: {
			accountData: fields,
			editableFields,
			fieldNames,
			allFields,
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
