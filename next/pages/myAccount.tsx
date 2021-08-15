import Link from "next/link";
import { ReactElement } from "react";
import { useIsAfterRehydration, useViewProtection } from "../client/utils/otherHooks";
import { useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { isLoggedIn, isOrg } from "../server/auth/session";
import { orgFieldNamesToShow, userFieldNamesToShow } from "../serverAndClient/displayNames";


export default function MyAccount({ accountData }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user"]);
	const userType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();

	return <div>
		<Head title="My account - cybervolunteers" />

		<p>Hello and welcome to my secure website</p>

		{/* Render common stuff normally */}
		{
			Object.entries(accountData ?? {}).map(([k, v]) => {

				if (typeof v === "string" && !isNaN(new Date(v).getDay())) // check if it is a date
					v = new Date(v).toDateString();

				return <p key={k}>
					<span>{k}: {v}</span>
				</p>;
			})
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
		const fieldKeys = Object.keys(fieldNames).filter(k => k in session); // only show the keys that have been specified
		fields = Object.fromEntries(fieldKeys.map(k => [(fieldNames as any)[k] ?? k, session[k]])); // translate them
	}

	console.log(session)

	return {
		props: {
			accountData: fields
		}, // will be passed to the page component as props
	};
};
