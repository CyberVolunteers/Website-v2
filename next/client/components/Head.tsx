import NextHead from 'next/head'
import { FC } from "react";

const Head: FC<{
	title: string
}> = ({ title }) => {
	if(process.env.IS_DEV && typeof window !== "undefined") window.wasHeadIncluded = true;
	return <NextHead>
		<title>{title}</title>
	</NextHead>
}

export default Head