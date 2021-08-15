import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { ReactElement } from "react";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { updateLoginState } from "../client/utils/userState";
import Head from "../client/components/Head";
import { csrfFetch } from "../client/utils/csrf";
import { updateCsrf } from "../server/csrf";


export default function Logout({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const router = useRouter();
	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	async function sendLogoutRequest() {
		const res = await csrfFetch(csrfToken, "/api/logout", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
		});
		if (!await updateOverallErrorsForRequests(res, "logoutPost", overallErrors, setOverallErrors)) return;

		updateLoginState();
		router.push("/searchListings"); // redirect
	}

	return <div>
		<Head title="Sign out - cybervolunteers" />

		Are you sure?

		{Object.keys(overallErrors).length === 0 ? null :
			<>
				<h1>Something went wrong:</h1>
				< h2 >
					{
						Object.values(overallErrors).map((e, index) => {
							return <p key={index}>
								{e}
							</p>;
						})
					}
				</h2>
			</>}

		<button className="submit" type="submit" onClick={sendLogoutRequest}>Sure!</button>
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context)
		}, // will be passed to the page component as props
	};
};
