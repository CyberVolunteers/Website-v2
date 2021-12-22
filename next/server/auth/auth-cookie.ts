import { seal, unseal } from "./iron";
import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";
import {
	accountInfoCookieName,
	cookieMaxAge,
	sessionCookieName,
	csrfCookieName,
} from "../../serverAndClient/cookiesConfig";
import { deepAssign, flatten } from "combined-validator";
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from "../types";
import { logger } from "../logger";
import { users } from "../../serverAndClient/publicFieldConstants";
import { isLoggedIn } from "./data";

const sessionCookieOptions: CookieSerializeOptions = {
	maxAge: cookieMaxAge,
	httpOnly: true, // stop the client from accessing the cookie
	sameSite: "strict",
	secure: true,
	path: "/",
};

const csrfCookieOptions: CookieSerializeOptions = {
	maxAge: cookieMaxAge,
	httpOnly: true, // stop the client from accessing the cookie
	sameSite: "strict",
	secure: true,
	path: "/",
};

const accountInfoCookieOptions: CookieSerializeOptions = {
	maxAge: cookieMaxAge,
	sameSite: "strict",
	secure: true,
	path: "/",
};

export type SessionObject = { [key: string]: any } | null;
export type CsrfObject = { [key: string]: string } | null;

/**
 * Get the session object of the current request
 * @param req the request to extract the data from
 * @returns the session object or null if there was an error
 */
export async function getSession(
	req: ExtendedNextApiRequest
): Promise<SessionObject> {
	// cache
	if (req.session !== undefined) return req.session;

	const out = (req.session = await unsealCookieRaw(
		req.cookies?.[sessionCookieName]
	));

	return out;
}

/**
 * deletes the cookie data along with the cached session data
 * @param req request to clear
 */
export async function clearServerSideSession(req: ExtendedNextApiRequest) {
	req.session = undefined;
	if (typeof req.cookies === "object" && req.cookies !== null)
		req.cookies[sessionCookieName] = "invalid cookie string";
}

/**
 * Gets the csrf tokens for all the pages
 * @param req the request to unwrap
 * @returns a object containing page paths and their tokens
 */
export async function getCsrf(
	req: ExtendedNextApiRequest
): Promise<CsrfObject> {
	if (req.csrfData !== undefined) return req.csrfData;

	const out = (req.csrfData = await unsealCookieRaw(
		req.cookies?.[csrfCookieName]
	));
	return out;
}

/**
 * Used to unseal a cookie safely
 * @param data the cookie contents (any type)
 * @returns data or `null` in case of an error
 */
async function unsealCookieRaw(data: any) {
	if (typeof data !== "string") return null;
	try {
		return await unseal(data);
	} catch (err) {
		return null;
	}
}

/**
 * Overrides the keys in the session with the ones specified by the data and csrf parameters
 * Note: if the `data` or the `csrf` parameters are `null`, the data will be destroyed
 * @param req the request object
 * @param res the response object
 * @param _data the overrides for the session object (if `undefined`, it is skipped)
 * @param _csrf the overrides for the csrf object (if `undefined`, it is skipped)
 */
export async function updateSession(
	req: ExtendedNextApiRequest,
	res: ExtendedNextApiResponse,
	_data?: SessionObject,
	_csrf?: CsrfObject
) {
	// TODO: check for the shape of data
	//NOTE: keeping "null"
	const data = _data === undefined ? {} : _data;
	const csrf = _csrf === undefined ? {} : _csrf;

	const session = (await getSession(req)) ?? {};
	const oldCsrf = (await getCsrf(req)) ?? {};

	const newData = data === null ? {} : deepAssign(session, data);
	const newCsrf = csrf === null ? {} : deepAssign(oldCsrf, csrf);

	if (newData?._doc !== undefined)
		logger.error(
			"server.auth-cookie:There is an error with _doc being sent to the cookie wrapper"
		);

	await setSession(res, newData, newCsrf);

	// set the new data
	req.csrfData = newCsrf;
	req.session = newData;
}

/**
 * Overrides the session to contain the new data and csrf. If either is undefined or null, it is treated as `{}`
 * @param res
 * @param _data
 * @param _csrf
 */
async function setSession(
	res: NextApiResponse,
	_data?: SessionObject,
	_csrf?: CsrfObject
) {
	const data = _data ?? {};
	const csrf = _csrf ?? {};
	// keep a cookie that tells the client that it is logged in and other data
	const isOrg = data?.isOrg === true;
	const publicData = {
		isOrg: isOrg,
		isSessionActive: true,
		isEmailVerified: data?.isEmailVerified === true,
		isOrganisationVerified: data?.isOrganisationVerified === true,
	} as { [key: string]: any };

	// if is a user
	if (!isOrg && isLoggedIn(data)) {
		// missing field names, e.g. when an optional field has not been set
		const allPublicKeys = Object.keys(flatten(users));
		const missingFieldNames = allPublicKeys.filter(
			// if the key is not found
			(v) =>
				!Object.keys(data ?? {}).includes(v) &&
				// also ignore the password because it isn't ever stored in the first place
				!["password"].includes(v)
		);
		// store both openly and in the session
		publicData.missingFields = missingFieldNames;
		data.missingFields = missingFieldNames;
	}

	const cookies = [
		serialize(
			accountInfoCookieName,
			JSON.stringify(publicData),
			accountInfoCookieOptions
		),
		serialize(sessionCookieName, await seal(data), sessionCookieOptions),
		serialize(csrfCookieName, await seal(csrf), csrfCookieOptions),
	];

	logger.info("server.auth.auth-cookie:Setting session");
	res.setHeader("Set-Cookie", cookies);
}

/**
 * Deletes all the known cookies
 * @param res
 */
export function removeSession(res: NextApiResponse) {
	const sessionCookie = serialize(sessionCookieName, "", sessionCookieOptions); // empty objects because the target object is modified
	const accountInfoCookie = serialize(
		accountInfoCookieName,
		"",
		accountInfoCookieOptions
	);

	// NOTE: leaving the csrf cookie
	logger.info("server.auth.auth-cookie:Destroying session");

	res.setHeader("Set-Cookie", [sessionCookie, accountInfoCookie]);
}
