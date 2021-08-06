import Link from "next/link";
import { ReactElement } from "react";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import { useViewerType } from "../client/utils/userState";

export default function MyAccount(): ReactElement {
	const userType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();

	return <div>
		<p>Hello and welcome to my secure website</p>

		{/* render the common stuff normally */}
		<p>
			<span>Email: {"email"}</span>
		</p>

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
