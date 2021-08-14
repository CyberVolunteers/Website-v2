import Link from "next/link";
import React, { ReactElement } from "react";
import Head from "../client/components/Head";
import { contactEmail } from "../serverAndClient/staticDetails";

export default function Error500(): ReactElement {
	return <div>
		<Head title="Server error - cybervolunteers" />
		<h1>We are sorry, something went wrong</h1>

		<p>Please email us at {contactEmail}</p>

		<Link href="/" passHref>
			<a>
				<p>
					Back to home page!
				</p>
			</a>
		</Link>

		{/* Etc */}
	</div>;
}
