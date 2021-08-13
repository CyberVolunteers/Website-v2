import { randomBytes } from "crypto";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getSession, updateSession } from "../server/auth/auth-cookie";
import { fixedTimeComparison } from "@hapi/cryptiles";
import { csrfHeaderName, csrfTokenLength, currentPageHeaderName } from "./headersConfig";

// server
function genRandomToken(length: number) {
    return randomBytes(Math.floor(length / 2)).toString("hex");
}

export async function updateCsrf(context: GetServerSidePropsContext<any>) {
    const newToken = genRandomToken(csrfTokenLength);
    const additionalSessionEntries: any = {};

    let index = context.resolvedUrl.indexOf("?");
    if (index === -1) index = context.resolvedUrl.length // remove everything up to the question mark
    const simpleUrl = context.resolvedUrl.substr(0, index);

    additionalSessionEntries.csrfToken = {};
    additionalSessionEntries.csrfToken[simpleUrl] = newToken;

    await updateSession(context.req as any, context.res as any, additionalSessionEntries);
    return newToken;
}

export async function checkCsrf(req: NextApiRequest, res: NextApiResponse) {
    const receivedPageName = req.headers[currentPageHeaderName.toLowerCase()];
    if (typeof receivedPageName !== "string") return res.status(400).send("Incorrect or undefined current page header");

    const expectedCsrfToken = (await getSession(req))?.csrfToken?.[receivedPageName]; // from the sealed csrf cookie
    const receivedCsrfToken = req.headers[csrfHeaderName.toLowerCase()]; // from the headers


    if (typeof receivedCsrfToken !== "string") return res.status(400).send("Incorrect or undefined csrf header");

    if (!fixedTimeComparison(expectedCsrfToken, receivedCsrfToken)) return res.status(403).send("Invalid csrf token");
}

// client
export async function csrfFetch(csrfToken: string, url: string, settings: any) {
    settings.headers = settings.headers ?? {};
    settings.headers[csrfHeaderName] = csrfToken;
    settings.headers[currentPageHeaderName] = window.location.pathname;
    return await fetch(url, settings);
}
