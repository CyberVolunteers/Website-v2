import Link from "next/link";
import { ReactElement } from "react";
import Head from "../../client/components/Head";

export default function Console(): ReactElement {
	return (
		<div>
			<Head title="Admin" />
			<meta name="robots" content="noindex" />
			<Link href="/admin_section_console/mongo" passHref>
				<a>
					<p>Mongo</p>
				</a>
			</Link>
		</div>
	);
}
