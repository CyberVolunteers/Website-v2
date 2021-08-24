import Link from "next/link";
import { ReactElement, useState } from "react";
import {
	useIsAfterRehydration,
	useViewProtection,
} from "../client/utils/otherHooks";
import { getAccountInfo, useViewerType } from "../client/utils/userState";
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
} from "../serverAndClient/publicFieldConstants";
import React from "react";
import EditableField from "../client/components/EditableField";
import { getSignupPerElementValidationCallbacks } from "../client/components/Signup";
import { updateCsrf } from "../server/csrf";
import { csrfFetch } from "../client/utils/csrf";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { CircularProgress } from "@material-ui/core";

export default function MyAccount({
	accountData: initAccountData,
	editableFields,
	fieldNames,
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user"]);

	const [isLoading, setIsLoading] = useState(false);
	const [fields, setFields] = useState(initAccountData);

	const [overallErrors, setOverallErrors] = useState(
		{} as { [key: string]: any }
	);

	const isOrg = getAccountInfo()?.isOrg;

	const userType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();

	async function sendEditRequest(k: string, v: any) {
		const url = `/api/update${isOrg ? "Org" : "User"}Data`;
		const data = {} as { [key: string]: any };
		data[k] = v;
		if (v === null) return; // do not submit data with errors

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

	return (
		<div>
			<Head title="My account - cybervolunteers" />

			<p>Hello and welcome to my secure website</p>

			{/* Render common stuff normally */}
			{Object.entries(fields ?? {}).map(([k, v]) => {
				return (
					<EditableField
						key={k}
						name={k}
						value={v}
						presentableNames={fieldNames}
						editableFields={editableFields}
						sendEditRequest={sendEditRequest}
						perElementValidationCallbacks={getSignupPerElementValidationCallbacks(
							overallErrors,
							setOverallErrors
						)}
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

			<Link href="/logout" passHref>
				<a>
					<p>Log out</p>
				</a>
			</Link>
		</div>
	);
}

type AccountDataType = null | {
	[key: string]: any;
};

export const getServerSideProps: GetServerSideProps<{
	accountData: AccountDataType;
	editableFields: Flattened;
	fieldNames: { [key: string]: string };
	csrfToken: string;
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	let fields: AccountDataType = null;
	let editableFields: Flattened = {};
	let fieldNames: { [key: string]: string } = {};
	if (isLoggedIn(session)) {
		const isRequestByAnOrg = isOrg(session);
		fieldNames = isRequestByAnOrg ? orgFieldNamesToShow : userFieldNamesToShow;

		editableFields = isRequestByAnOrg
			? flatten(orgDataUpdateSpec)
			: flatten(userDataUpdateSpec);

		const fieldKeys = Object.keys(fieldNames).filter((k) => k in session); // only show the keys that have been specified
		fields = Object.fromEntries(fieldKeys.map((k) => [k, session[k]])); // translate them
	}

	return {
		props: {
			accountData: fields,
			editableFields,
			fieldNames,
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
