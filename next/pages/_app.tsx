import "../client/styles/global.css";
import type { AppProps } from "next/app";
import Header from "../client/components/Header";
import React from "react";
import Footer from "../client/components/Footer";
import { ReactElement } from "react";

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return <>
		<Header />
		<Component {...pageProps} />
		<Footer />
	</>;
}
export default MyApp;
