import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useEffect } from "react";
import { ReactElement } from "react";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import { useViewerType } from "../client/utils/userState";
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
				default:
					return <p>Please log in to view that page</p>;
				}
			})()
		}
		<Link href={`/login?redirect=${router.query.redirect ?? ""}`} passHref>
			<a>
				<p>
					Log in!
				</p>
			</a>
		</Link>
	</div>;
}
