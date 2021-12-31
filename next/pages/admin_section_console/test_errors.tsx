import Link from "next/link";
import { ReactElement, useState } from "react";
import Head from "../../client/components/Head";

export default function Console(): ReactElement {
	const [showErrorComponent, setShowErrorComponent] = useState(false);
	return (
		<div>
			<Head title="Test errors" />
			<meta name="robots" content="noindex" />
			<button
				onClick={() => {
					setShowErrorComponent(!showErrorComponent);
				}}
			>
				Toggle error component?
			</button>

			<button
				onClick={() => {
					throw new Error("Test error");
				}}
			>
				On click error
			</button>

			{showErrorComponent ? <ErrorComponent /> : null}
		</div>
	);
}

export function ErrorComponent() {
	throw new Error("Test error");
	return <></>;
}
