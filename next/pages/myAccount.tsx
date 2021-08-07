import Link from "next/link";
import { ReactElement } from "react";
import { useIsAfterRehydration, useViewProtection } from "../client/utils/otherHooks";
import { useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { updateCsrf } from "../serverAndClient/csrf";
import { flatten } from "combined-validator";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { isLoggedIn, isOrg } from "../server/auth/session";
import { undoCamelCase } from "../client/utils/misc";


export default function MyAccount({ accountData }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user"]);
	const userType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();

	return <div>
		<Head title="My account - cybervolunteers" />

		<p>Hello and welcome to my secure website</p>

		{/* Render common stuff normally */}
		{
			Object.entries(accountData ?? {}).map(([k, v]) =>
				<p key={k}>
					{console.log(k, v)}
					<span>{k}: {v}</span>
				</p>
			)
		}
		{

			(() => {
				//only render the stuff that differs on client-side to not run into issues with rehydration: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
				if (!isAfterRehydration) return null;

				switch (userType) {
					case "org":
						return <>
							<div>
								<Link href="/manageListings" passHref>
									<a>
										<p>
											Manage listings
										</p>
									</a>
								</Link>
							</div>
						</>;
					case "user":
						return <div>
							Do stuff as a volunteer
						</div>;
					default:
						return <p>Please log in to view this</p>;
				}
			})()

		}

		{/* Etc */}

		<Link href="/logout" passHref>
			<a>
				<p>
					Log out
				</p>
			</a>
		</Link>
	</div>;
}

const orgFieldNamesToShow = {
	email: "Your email",
	orgType: "The type of your organisation",
	orgName: "The name of your organisation",
	orgDesc: "The description of your organisation",
	orgLocation: "The location of your organisation",
	phoneNumber: "Your phone number",
	websiteUrl: "The address of your website",
}

const userFieldNamesToShow = {
	firstName: "First name",
	lastName: "Last name",
	email: "Your email",
	gender: "Your specified gender",
	city: "Your city",
	country: "Your country",
	skillsAndInterests: "Your skills and interests",
	birthDate: "Your date of birth",
	nationality: "Your nationality",
	phoneNumber: "Your phone number",
}

type AccountDataType = null | {
	[key: string]: any
}

export const getServerSideProps: GetServerSideProps<{
	accountData: AccountDataType
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	let fields: AccountDataType = null;
	if (isLoggedIn(session)) {
		const fieldNames = isOrg(session) ? orgFieldNamesToShow : userFieldNamesToShow;
		const fieldKeys = Object.keys(fieldNames);
		fields = Object.fromEntries(fieldKeys.map(k => [(fieldNames as any)[k] ?? k, session[k]]))
		console.log(fields)
	}

	return {
		props: {
			accountData: fields
		}, // will be passed to the page component as props
	};
};
