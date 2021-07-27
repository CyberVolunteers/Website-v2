import { seal, unseal } from "./iron"
import { serialize, parse } from "cookie"
import { NextApiRequest, NextApiResponse } from "next"
import { isSessionActiveCookieName, sessionCookieMaxAge, sessionCookieName } from "../config/shared/config"

export async function getSession(req: NextApiRequest) {
    const sessionCookie = req.cookies?.[sessionCookieName];

    if (sessionCookie === undefined) return null;
    try {
        return await unseal(sessionCookie);
    } catch (err) {
        return null;
    }
}

export async function refreshSession(res: NextApiResponse, data: any) {
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
