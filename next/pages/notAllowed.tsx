import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useEffect } from "react";
import { ReactElement } from "react";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import { getAccountInfo, useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";

export default function NotAllowed(): ReactElement {
	const router = useRouter();
	const currentUser = useViewerType();
	const isAfterHydration = useIsAfterRehydration();

	// redirect if needed
	useEffect(() => {
		const redirect = router.query.redirect;
		if (router.query.required?.includes(currentUser)) router.push(typeof redirect === "string" ? redirect : "/");
	}, [currentUser, router]);

	return <div>
		<Head title="Access not allowed - cybervolunteers" />

		{
			(() => {
				if (!isAfterHydration) return null;
				switch (currentUser) {
				case "org":
					return <p>Please log in as a volunteer to view that page</p>;
				case "user":
					return <p>Please log in as an organisation to view that page</p>;
				case "unverified_user":
					return <p>Please verify your email to view this page.</p>;
				case "unverified_org":
				{
					const phrases = [];
					const accountInfo = getAccountInfo();
					if (accountInfo?.isEmailVerified !== true) phrases.push("Please verify your email to view that page. ");
					if (accountInfo?.isOrganisationVerified !== true) phrases.push(`We ${phrases.length > 0 ? "also " : ""}need to verify your organisation, which may take some time. Note that we may contact you for extra details regarding your charity.`);
					return <p>{phrases}</p>;
				}
				default:
					return <p>Please log in to view that page</p>;
				}
			})()
		}
		{
			currentUser === "unverified_user" || currentUser === "unverified_org" ?
				//TODO: change this page url
				<Link href={`/login?redirect=${router.query.redirect ?? ""}`} passHref>
					<a>
						<p>
							Verify my email!
						</p>
					</a>
				</Link> :
				<Link href={`/login?redirect=${router.query.redirect ?? ""}`} passHref>
					<a>
						<p>
							Log in!
						</p>
					</a>
				</Link>
		}
	</div>;
}
