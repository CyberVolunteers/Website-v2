import { randomBytes } from "crypto";
import {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from "next";
import { getCsrf, getSession, updateSession } from "./auth/auth-cookie";
import { fixedTimeComparison } from "@hapi/cryptiles";
import {
	csrfHeaderName,
	csrfTokenLength,
	currentPageHeaderName,
} from "../serverAndClient/headersConfig";
import { logger } from "./logger";

// TODO: allow having two instances of the same page open at the same time

/**
 * Generates a random hex string of a specified length
 * @param length
 * @returns a random hex string
 */
function genRandomToken(length: number) {
	// one byte per two hex characters
	return randomBytes(Math.ceil(length / 2))
		.toString("hex")
		.substr(0, length);
}

/**
 * Sets a new random token for the current page, while updating the session
 * @param context nextjs context
 * @returns the new random token
 */
export async function updateCsrf(context: GetServerSidePropsContext<any>) {
	const newToken = genRandomToken(csrfTokenLength);

	let index = context.resolvedUrl.indexOf("?");
	if (index === -1) index = context.resolvedUrl.length; // remove everything up to the question mark
	const simpleUrl = context.resolvedUrl.substr(0, index);

	const csrfTokens = {} as { [key: string]: any };
	csrfTokens[simpleUrl] = newToken;

	logger.info("server.csrf:Adding csrf path, %s", csrfTokens);
	await updateSession(
		context.req as any,
		context.res as any,
		undefined,
		csrfTokens
	);
	return newToken;
}

/**
 * Checks that the token received from the client is the same one as the one from within the sealed cookie
 * NOTE: it might send headers if the csrf token is incorrect
 * @param req
 * @param res
 * @returns undefined
 */
export async function enforceValidCsrf(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const receivedPageName = req.headers[currentPageHeaderName.toLowerCase()];
	if (typeof receivedPageName !== "string") {
		logger.info("server.csrf:Incorrect or undefined current page header");

		return res
			.status(400)
			.send("The data we received was incorrect. Please refresh the page");
	}

	const expectedCsrfToken =
		(await getCsrf(req))?.[receivedPageName] ?? "not-present"; // from the sealed csrf cookie
	const receivedCsrfToken = req.headers[csrfHeaderName.toLowerCase()]; // from the headers

	if (typeof receivedCsrfToken !== "string") {
		logger.info("server.csrf:Incorrect or undefined csrf header");

		return res
			.status(400)
			.send("Something we received was incorrect. Please refresh the page");
	}

	logger.info(
		"Stored tokens: %s, received tokens: %s",
		await getCsrf(req),
		receivedCsrfToken
	);

	if (!fixedTimeComparison(expectedCsrfToken, receivedCsrfToken)) {
		logger.info("server.csrf:Invalid csrf token");

		return res
			.status(403)
			.send(
				"Something went wrong. This is almost always solved by refreshing the page."
			);
	}
}
