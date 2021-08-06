import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import { updateLoginState } from "../client/utils/userState";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";

export default function Logout({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {

	async function sendLogoutRequest() {
		await csrfFetch(csrfToken, "/api/logout", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
		});

		updateLoginState();
	}

	return <div>
		Are you sure?

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
