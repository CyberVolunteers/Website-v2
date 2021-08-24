import { ReactElement } from "react";
import Head from "../client/components/Head";

export default function Home(): ReactElement {
	return (
		<div>
			<Head title="Cybervolunteers" />
			<p>We are the Cybervolunteers and this is our home page</p>

			{/* Etc */}
		</div>
	);
}
