import { seal, unseal } from "./iron"
import { serialize, CookieSerializeOptions } from "cookie"
import { NextApiResponse } from "next"
import { accountInfoCookieName, cookieMaxAge, sessionCookieName, csrfCookieName } from "../../serverAndClient/cookiesConfig"
import { deepAssign } from "combined-validator";
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from "../types";
import { logger } from "../logger";

const sessionCookieOptions: CookieSerializeOptions = {
    maxAge: cookieMaxAge,
    httpOnly: true, // stop the client from accessing the cookie
    sameSite: "strict",
    secure: true,
    path: "/"
}

const csrfCookieOptions: CookieSerializeOptions = {
    maxAge: cookieMaxAge,
    httpOnly: true, // stop the client from accessing the cookie
    sameSite: "strict",
    secure: true,
    path: "/"
}

const accountInfoCookieOptions: CookieSerializeOptions = {
    maxAge: cookieMaxAge,
    sameSite: "strict",
    secure: true,
    path: "/"
}

export async function getSession(req: ExtendedNextApiRequest) {
    if (req.session !== undefined) return req.session;

    const out = req.session = await unsealCookieRaw(req.cookies?.[sessionCookieName]);

    return out;
}

export async function getCsrf(req: ExtendedNextApiRequest) {
    if (req.csrfData !== undefined) return req.csrfData;

    const out = req.csrfData = await unsealCookieRaw(req.cookies?.[csrfCookieName]);

    return out;
}

async function unsealCookieRaw(data: any) {
    if (data === undefined) return null;
    try {
        return await unseal(data);
    } catch (err) {
        return null;
    }
}

export async function updateSession(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse, data?: any, csrf?: any) {
    const session = await getSession(req) ?? {};
    const oldCsrf = await getCsrf(req) ?? {};

    const newData = data === undefined ? session : deepAssign(session, data);
    const newCsrf = csrf === undefined ? oldCsrf : deepAssign(oldCsrf, csrf);

    await setSession(res, newData, newCsrf);
    req.session = newData;
}

async function setSession(res: NextApiResponse, data?: any, csrf?: any) {
    // keep a cookie that tells the client that it is logged in and other data
    const publicData = {
        "isOrg": data?.isOrg === true,
        "isSessionActive": true,
        "isEmailVerified": data?.isEmailVerified === true,
        "isOrganisationVerified": data?.isOrganisationVerified === true,
    }

    const cookies = [serialize(accountInfoCookieName, JSON.stringify(publicData), accountInfoCookieOptions)];

    if (csrf !== undefined) cookies.push(serialize(csrfCookieName, await seal(csrf), csrfCookieOptions));
    if (data !== undefined) cookies.push(serialize(sessionCookieName, await seal(data), sessionCookieOptions));

    logger.info("server.auth.auth-cookie:Setting session");

    res.setHeader('Set-Cookie', cookies)
}

export function removeSession(res: NextApiResponse) {
    const emptyCookieSettings = {
        maxAge: -1,
        path: '/',
    }
    const sessionCookie = serialize(sessionCookieName, '', Object.assign({}, sessionCookieOptions, emptyCookieSettings)) // empty objects because the target object is modified
    const accountInfoCookie = serialize(accountInfoCookieName, '', Object.assign({}, accountInfoCookieOptions, emptyCookieSettings))

    // NOTE: leaving the csrf cookie

    logger.info("server.auth.auth-cookie:Destroying session");


    res.setHeader('Set-Cookie', [sessionCookie, accountInfoCookie])
}
