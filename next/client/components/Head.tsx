import NextHead from 'next/head'
import { FC } from "react";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Head: FC<{
	title: string
}> = ({ title }) => {
	if(publicRuntimeConfig.IS_DEV && typeof window !== "undefined") window.wasHeadIncluded = true;
	return <NextHead>
		<title>{title}</title>
	</NextHead>
}

export default Head