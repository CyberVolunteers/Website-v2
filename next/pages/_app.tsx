import "../client/styles/global.css";
import type { AppProps } from "next/app";
import Header from "../client/components/Header";
import React from "react";
import Footer from "../client/components/Footer";
import { ReactElement } from "react";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import getConfig from "next/config";
import CookieBanner from "../client/components/CookieBanner";

// TODO: move it into the module
import "../client/styles/cookiePopup.css";
import "../client/styles/index.css";
import "../client/styles/communityCards.css";
import "../client/styles/customForm.css";
import "../client/styles/login.css";
import "../client/styles/userSignup.css";
import "../client/styles/selectBox.css";
import "../client/styles/form.css";

const { publicRuntimeConfig } = getConfig();

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	const router = useRouter();

	const out = (
		<>
			<Header />
			<Component {...pageProps} />
			<Footer />
			<CookieBanner />
		</>
	);

	// don't bother with that if it is not a development server
	if (!publicRuntimeConfig.IS_DEV) return out;

	if (typeof window !== "undefined") window.wasHeadIncluded = false;

	// check that head is included
	// eslint will say that we are using a hook conditionally, but that only happens depending on whether it is in production or not
	// eslint-disable-next-line
	useEffect(() => {
		if (!window.wasHeadIncluded)
			throw new Error("Please don't forget about the <Head> tag");
	}, [router]);

	return out;
}
export default MyApp;
