import { randomBytes } from "crypto";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getCsrf, getSession, updateSession } from "./auth/auth-cookie";
import { fixedTimeComparison } from "@hapi/cryptiles";
import { csrfHeaderName, csrfTokenLength, currentPageHeaderName } from "../serverAndClient/headersConfig";
import { logger } from "./logger";

// server
function genRandomToken(length: number) {
    return randomBytes(Math.floor(length / 2)).toString("hex");
}

export async function updateCsrf(context: GetServerSidePropsContext<any>) {
    const newToken = genRandomToken(csrfTokenLength);

    let index = context.resolvedUrl.indexOf("?");
    if (index === -1) index = context.resolvedUrl.length // remove everything up to the question mark
    const simpleUrl = context.resolvedUrl.substr(0, index);

    const csrfTokens = {} as { [key: string]: any };
    csrfTokens[simpleUrl] = newToken;

    logger.info("server.csrf:Setting csrf cookie");
    await updateSession(context.req as any, context.res as any, undefined, csrfTokens);
    return newToken;
}

export async function checkCsrf(req: NextApiRequest, res: NextApiResponse) {
    const receivedPageName = req.headers[currentPageHeaderName.toLowerCase()];
    if (typeof receivedPageName !== "string") {
        logger.info("server.csrf:Incorrect or undefined current page header");
        
        return res.status(400).send("Incorrect or undefined current page header");
    }

    const expectedCsrfToken = (await getCsrf(req))?.[receivedPageName]; // from the sealed csrf cookie
    const receivedCsrfToken = req.headers[csrfHeaderName.toLowerCase()]; // from the headers


    if (typeof receivedCsrfToken !== "string") {
        logger.info("server.csrf:Incorrect or undefined csrf header");

        return res.status(400).send("Incorrect or undefined csrf header");
    }

    if (!fixedTimeComparison(expectedCsrfToken, receivedCsrfToken)) {
        logger.info("server.csrf:Invalid csrf token");

        return res.status(403).send("Invalid csrf token");
    }
}
