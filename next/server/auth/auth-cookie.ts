import { seal, unseal } from "./iron"
import { serialize, CookieSerializeOptions } from "cookie"
import { NextApiResponse } from "next"
import { accountInfoCookieName, cookieMaxAge, sessionCookieName, csrfCookieName } from "../../serverAndClient/cookiesConfig"
import { deepAssign } from "combined-validator";
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from "../types";

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

    
    const publicData = {
        "isOrg": data?.isOrg === true,
        "isSessionActive": true,
        "isEmailVerified": data?.isEmailVerified === true,
        "isOrganisationVerified": data?.isOrganisationVerified === true,
    }

    // keep a cookie that tells the client that it is logged in
    const accountInfoCookie = serialize(accountInfoCookieName, JSON.stringify(publicData), accountInfoCookieOptions)

    const csrfCookie = serialize(csrfCookieName, await seal(data.csrfToken), csrfCookieOptions)

    res.setHeader('Set-Cookie', [sessionCookie, accountInfoCookie, csrfCookie])
}

export function removeSession(res: NextApiResponse) {
    const emptyCookieSettings = {
        maxAge: -1,
        path: '/',
    }
    const sessionCookie = serialize(sessionCookieName, '', Object.assign({}, sessionCookieOptions, emptyCookieSettings)) // empty objects because the target object is modified
    const accountInfoCookie = serialize(accountInfoCookieName, '', Object.assign({}, accountInfoCookieOptions, emptyCookieSettings))

    // NOTE: leaving the csrf cookie


    res.setHeader('Set-Cookie', [sessionCookie, accountInfoCookie])
}
