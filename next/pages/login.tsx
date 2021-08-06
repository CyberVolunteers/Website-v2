import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
import { ReactElement } from "react";
import { useState } from "react";
import { updateLoginState } from "../client/utils/userState";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";

export default function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	async function onSubmit() {
		await csrfFetch(csrfToken, "/api/login", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify({
				email,
				password
			})
		});
		const isLoggedIn = updateLoginState();

		if (isLoggedIn) router.push(typeof router.query.redirect === "string" ? router.query.redirect : "/searchListings");
	}

	return <div>
		Hello and welcome to my secure website
		<br />

		<label htmlFor="email">Email</label>
		<input type="email" className="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

		<br />

		<label htmlFor="pwd">Password</label>
		<input className="pwd" name="pwd" value={password} onChange={(e) => setPassword(e.target.value)}></input>

		<br />

		<button className="submit" type="submit" onClick={onSubmit}>Wow, i sure do trust this website!</button>
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
