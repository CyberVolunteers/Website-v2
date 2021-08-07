import { ReactElement } from "react";
import { useViewProtection } from "../client/utils/otherHooks";
import Link from "next/link";
import Head from "../client/components/Head";


export default function ManageListings(): ReactElement {
	useViewProtection(["org"]);

	return <div>
		<Head title="Manage listings - cybervolunteers" />
		<h1>Don&#39;t go crazy with your power!</h1>

		<Link href="/createListing" passHref>
			<a>
				<p>
					We need more listings!
				</p>
			</a>
		</Link>
	</div>;
}

