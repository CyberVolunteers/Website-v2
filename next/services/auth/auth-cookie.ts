import { seal, unseal } from "./iron"
import { serialize, parse } from "cookie"
import { NextApiRequest, NextApiResponse } from "next"
import { isSessionActiveCookieName, sessionCookieMaxAge, sessionCookieName } from "../config/shared/config"
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from "../../lib/utils/apiRequests";
import { deepAssign } from "combined-validator";

export async function getSession(req: ExtendedNextApiRequest) {
    if (req.session !== undefined) return req.session;

    const out = req.session = await getSessionRaw(req);
    return out;
}

async function getSessionRaw(req: ExtendedNextApiRequest) {
    const sessionCookie = req.cookies?.[sessionCookieName];

    if (sessionCookie === undefined) return null;
    try {
        return await unseal(sessionCookie);
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

export async function setSession(res: NextApiResponse, data: any) {
    const payload = await seal(data);
    const sessionCookie = serialize(sessionCookieName, payload, {
        maxAge: sessionCookieMaxAge,
        httpOnly: true, // stop the client from accessing the cookie
        sameSite: "strict",
        secure: true,
        path: "/"
    })

    // keep a cookie that tells the client that it is logged in
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, "true", {
        maxAge: sessionCookieMaxAge,
        sameSite: "strict",
        secure: true,
        path: "/"
    })

    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie])
}

export function removeSession(res: NextApiResponse) {
    const emptyCookieSettings = {
        maxAge: -1,
        path: '/',
    }
    const sessionCookie = serialize(sessionCookieName, '', emptyCookieSettings)
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, '', emptyCookieSettings)

    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie])
}
