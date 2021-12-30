import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Head from "../../client/components/Head";
import { csrfFetch } from "../../client/utils/csrf";
import { updateCsrf } from "../../server/csrf";

export default function MakePostRequest({
	csrfToken,
}: {
	csrfToken: string;
}): ReactElement {
	if (typeof window !== "undefined")
		// eslint-disable-next-line
		//@ts-ignore
		window.makePostRequest = async function (
			path: string,
			data: { [key: string]: string }
		) {
			const res = await csrfFetch(csrfToken, `/api/${path}`, {
				method: "POST",
				credentials: "same-origin", // only send cookies for same-origin requests
				headers: {
					"content-type": "application/json",
					accept: "application/json",
				},
				body: JSON.stringify(data),
			});
			// eslint-disable-next-line
			if (res.status >= 400) return console.log(await res.text());

			let newData = await res.text();
			try {
				newData = JSON.parse(newData);
				// eslint-disable-next-line
			} catch {}

			// eslint-disable-next-line
			//@ts-ignore
			window.newData = newData;
			// eslint-disable-next-line
			console.log(newData);
		};

	return (
		<div>
			<Head title="Admin" />
			<meta name="robots" content="noindex" />
			Look into the console.
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
