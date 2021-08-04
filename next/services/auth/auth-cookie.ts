import { seal, unseal } from "./iron"
import { serialize, CookieSerializeOptions } from "cookie"
import { NextApiResponse } from "next"
import { isOrgCookieName, isSessionActiveCookieName, sessionCookieMaxAge, sessionCookieName, csrfCookieName } from "../../config/shared/config"
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from "../../lib/utils/apiRequests";
import { deepAssign } from "combined-validator";

const sessionCookieOptions: CookieSerializeOptions = {
    maxAge: sessionCookieMaxAge,
    httpOnly: true, // stop the client from accessing the cookie
    sameSite: "strict",
    secure: true,
    path: "/"
}

const csrfCookieOptions: CookieSerializeOptions = {
    maxAge: sessionCookieMaxAge,
    httpOnly: true, // stop the client from accessing the cookie
    sameSite: "strict",
    secure: true,
    path: "/"
}

const isSessionActiveCookieOptions: CookieSerializeOptions = {
    maxAge: sessionCookieMaxAge,
    sameSite: "strict",
    secure: true,
    path: "/"
}

const isOrgCookieOptions: CookieSerializeOptions = {
    maxAge: sessionCookieMaxAge,
    sameSite: "strict",
    secure: true,
    path: "/"
}

export async function getSession(req: ExtendedNextApiRequest) {
    if (req.session !== undefined) return req.session;

    const out = req.session = deepAssign(await getCookieRaw(req.cookies?.[sessionCookieName]), {
        csrfToken: await getCookieRaw(req.cookies?.[csrfCookieName])
    });

    return out;
}

async function getCookieRaw(data: any) {
    if (data === undefined) return null;
    try {
        return await unseal(data);
    } catch (err) {
        return null;
    }
}

export async function updateSession(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse, updateInstructions: any) {
    const session = await getSession(req) ?? {};

    const newData = deepAssign(session, updateInstructions);

    await setSession(res, newData);
    req.session = newData;
}

async function setSession(res: NextApiResponse, data: any) {
    // delete all proto stuff

    const dataCopyNoCsrf = Object.assign({}, data);
    delete dataCopyNoCsrf["csrfToken"];

    const payloadWithoutCsrfToken = await seal(dataCopyNoCsrf);
    const sessionCookie = serialize(sessionCookieName, payloadWithoutCsrfToken, sessionCookieOptions)

    // keep a cookie that tells the client that it is logged in
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, "true", isSessionActiveCookieOptions)

    const csrfCookie = serialize(csrfCookieName, await seal(data.csrfToken), csrfCookieOptions)

    const isOrgCookieNameCookie = serialize(isOrgCookieName, `${data?.isOrg === true}`, isOrgCookieOptions)

    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie, csrfCookie, isOrgCookieNameCookie])
}

export function removeSession(res: NextApiResponse) {
    const emptyCookieSettings = {
        maxAge: -1,
        path: '/',
    }
    const sessionCookie = serialize(sessionCookieName, '', Object.assign(sessionCookieOptions, emptyCookieSettings))
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, '', Object.assign(isSessionActiveCookieOptions, emptyCookieSettings))
    const isOrgCookieNameCookie = serialize(isOrgCookieName, '', Object.assign(isOrgCookieOptions, emptyCookieSettings))

    // NOTE: leaving the csrf cookie


    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie, isOrgCookieNameCookie])
}
