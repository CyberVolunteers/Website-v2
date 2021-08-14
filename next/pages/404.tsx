import Link from "next/link";
import React, { ReactElement } from "react";
import Head from "../client/components/Head";

export default function Error404(): ReactElement {
	return <div>
		<Head title="Not found - cybervolunteers" />
		<h1>We are sorry, we couldn't find this page</h1>
		<Link href="/" passHref>
			<a>
				<p>
					Back to the home page!
				</p>
			</a>
		</Link>
	</div>;
}
