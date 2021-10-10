import { hash, verifyHash } from "./password";
import { Listing, Org, User } from "../mongo/mongoModels";
import getConfig from "next/config";
import { logger } from "../logger";

const { publicRuntimeConfig } = getConfig();

/**
 * Determines whether the email belongs to a user or an organisation and logs them in
 * @param credentials an object containing an `email` and a `password` string
 * @returns
 */
export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<
	| {
			[key: string]: any;
	  }
	| false
> {
	// find instead of findOne to keep the time roughly constant relative to when there are no results
	const [users, organisations] = await Promise.all([
		User.find({ email }),
		Org.find({ "creds.email": email }),
	]);

	const emailWasFound = users.length !== 0 || organisations.length !== 0;
	const doesEmailBelongToUser = organisations.length === 0;

	let accountData: { [key: string]: any } = !emailWasFound
		? {
				passwordHash: "this should never match", // a dummy "hash" against timing attacks
		  }
		: doesEmailBelongToUser
		? users[0]
		: organisations[0];

	// prepare it for the future access
	accountData = extractData(accountData, email);

	logger.info(
		"server.auth.session:Were login credentials found in the db?: %s",
		emailWasFound
	);

	const isCorrectHash = await verifyHash(
		password,
		accountData.passwordHash,
		// update the hash
		async (newHash) => {
			// TODO: test this, esp. for orgs
			accountData = await changeByEmail(email, { passwordHash: newHash });
		}
	);

	accountData.isOrg = !doesEmailBelongToUser;

	return isCorrectHash && emailWasFound ? accountData : false;
}

declare type Creds = {
	email: string;
	passwordHash: string;
	isEmailVerified: boolean;
};

/**
 * Select the correct user for an org from raw data
 * @param user session
 * @param targetEmail email to search for
 * @returns
 */
function extractOrgData(user: any, targetEmail: string) {
	logger.info("server.auth.data: Extracting org data from %s", user);
	// must be only one set of credentials

	// get a list of credentials with matching emails
	const creds = (user.creds as (Creds & { _doc: Creds })[]).filter(
		({ email }) => email === targetEmail
	);

	if (creds.length !== 1)
		throw new Error(`server.data:Expected one email, found ${creds.length}`);

	const out = {
		...user,
		...creds[0]._doc,
	};

	delete out.creds;

	logger.info("server.auth.data: Extraction result: %s", out);

	return out;
}

/**
 * Extracts data from _doc and automatically decides whether to use extractOrgData
 * @param data
 * @param email
 * @returns
 */
export function extractData(data: any, email: string | null) {
	if (data === null) return;
	data = data._doc ?? data;
	// see if it is a user and not a random piece of data
	const isOrg = data.orgType !== undefined;

	if (isOrg) {
		if (email === null)
			throw new Error(
				"server.auth.data: The email was null while extracting org data"
			);
		return extractOrgData(data, email);
	}

	return data;
}

/**
 * Creates an account for the user and returns its data
 * @param _params data for the new user
 * @returns
 */
export async function signupUser(_params: { [key: string]: any }) {
	// make a copy
	const params = Object.assign({}, _params);
	const passwordHash = await hash(params.password);
	delete params.password;
	params.passwordHash = passwordHash;
	const newUser = new User(params);

	if ((await isEmailFree(params.email)) === false) {
		logger.info("server.auth.session:Email used for user");

		return false;
	}

	const user = await newUser.save();
	return extractData(user, null);
}

/**
 * Creates an account for an organisation and returns its data
 * @param params data for the new organisation
 * @returns
 */
export async function signupOrg(_params: { [key: string]: any }) {
	// make a copy
	const params = Object.assign({}, _params);
	const email = params.email;

	const passwordHash = await hash(params.password);

	params.creds = [{ passwordHash, email }];
	params.contactEmails = [email];

	delete params.password;
	delete params.email;

	const newUser = new Org(params);

	if ((await isEmailFree(email)) === false) {
		logger.info("server.auth.session:Email used for org");
		return false;
	}
	const user = await newUser.save();

	return extractOrgData(user, email);
}

/**
 * Returns a boolean value, fetching the database without caching
 * @param email
 * @returns whether the email was found
 */
export async function isEmailFree(email: string): Promise<boolean> {
	// parallelize to make it as quick as possible
	async function passOnFound(p: Promise<any>): Promise<true> {
		if ((await p) === null) throw new Error("Email not found");
		return true;
	}

	try {
		await Promise.any([
			passOnFound(User.findOne({ email })),
			passOnFound(Org.findOne({ "creds.email": email })),
		]);
		return false;
	} catch {
		return true;
	}
}

/**
 * Update user data
 * @param data new data
 * @param email
 * @returns
 */
export async function updateUserData(
	data: any,
	email: string
): Promise<{ [key: string]: any } | null> {
	return await updateData(data, { email }, User);
}

/**
 * Update organisation data
 * @param data new organisation data
 * @param email
 * @returns
 */
export async function updateOrgData(
	data: any,
	email: string
): Promise<{ [key: string]: any } | null> {
	return await updateData(data, { "creds.email": email }, Org, email);
}

/**
 *
 * @param data
 * @param orgId
 * @param uuid
 * @returns
 */
export async function updateListingData(
	data: any,
	orgId: string,
	uuid: string
): Promise<{ [key: string]: any } | null> {
	// NOTE: requires org id so that an organisation can not modify other orgnaisations' listings
	return await updateData(data, { organisation: orgId, uuid }, Listing);
}

/**
 * Updates a piece of data for a user with new fields and returns them
 * @param data the new data
 * @param constraints selectors to find the data to update
 * @param model the model to perform the action on
 * @param email if specifies, passes it to `extrctData`
 * @returns the new data, as stored in the db (and processed by extractData)
 */
async function updateData(
	data: any,
	constraints: { [key: string]: any },
	model: typeof User | typeof Org | typeof Listing,
	email?: string
): Promise<{ [key: string]: any } | null> {
	let doc = await model.findOneAndUpdate(constraints, data, {
		new: true,
		upsert: false, // do not create a new one
	});
	return extractData(doc, email ?? null);
}

/**
 * Updates data for a user, automatically determining the type by email
 * @param email
 * @param newData
 * @returns the new data, as stored in the db (and processed by extractData)
 */
async function changeByEmail(email: string, newData: { [key: string]: any }) {
	const latestEmail = newData.email ?? email; // make sure to get the latest email data
	// find instead of findOne to keep the time roughly constant relative to when there are no results
	const [users, organisations] = await Promise.all([
		User.find({ email }),
		Org.find({ "creds.email": email }),
	]);

	// no such email
	if (users.length === 0 && organisations.length === 0) return null;

	const doesEmailBelongToUser = users.length !== 0;

	const searchParams = doesEmailBelongToUser
		? { email }
		: { "creds.email": email };

	const model = doesEmailBelongToUser ? User : Org;

	// make sure to put the modified data into the array if a charity
	if (!doesEmailBelongToUser) {
		const perUserFields = ["email", "isEmailVerified", "passwordHash"];
		Object.entries(newData).forEach(([k, v]) => {
			if (perUserFields.includes(k)) {
				newData.$set = newData.$set ?? {};
				newData.$set[`creds.$.${k}`] = v;
				delete newData[k];
			}
		});
	}

	return extractData(
		await model.findOneAndUpdate(searchParams, newData, {
			new: true,
			upsert: false, // do not create a new one
		}),
		latestEmail
	);
}

/**
 * Change the email for an account
 * @param oldEmail
 * @param newEmail
 * @returns the new data, as stored in the db (and processed by extractData)
 */
export async function changeEmail(oldEmail: string, newEmail: string) {
	if ((await isEmailFree(newEmail)) === false) {
		logger.info("server.auth.session:Email used for user");

		return null;
	}

	return await changeByEmail(oldEmail, {
		email: newEmail,
		isEmailVerified: false,
	});
}

/**
 * Verifies the account's email
 * @param email
 * @returns the new data, as stored in the db (and processed by extractData)
 */
export async function setEmailAsVerified(email: string) {
	return await changeByEmail(email, {
		isEmailVerified: true,
	});
}

/**
 * Updates the password of an account
 * @param email
 * @param password
 * @returns the new data, as stored in the db (and processed by extractData)
 */
export async function setPassword(email: string, password: string) {
	const passwordHash = await hash(password);
	return await changeByEmail(email, {
		passwordHash,
	});
}

/**
 * Records that a user has joined a listing
 * @param userId
 * @param listingUuid
 * @returns the new listing data, as stored in the db (and processed by extractData)
 */
export async function addUserToListing(userId: string, listingUuid: string) {
	const out = await Listing.findOneAndUpdate(
		{
			uuid: listingUuid,
			users: {
				$ne: userId,
			},
		},
		{
			$push: {
				users: userId,
			},
		},
		{
			new: true,
			upsert: false, // do not create a new one
		}
	);

	return extractData(out, null);
}

/**
 * Checks if the user is logged in
 * @param session
 * @returns boolean
 */
export function isLoggedIn(session: any): boolean {
	return typeof session === "object" && typeof session?.email === "string";
}

/**
 * Checks if the user is verified
 * @param session
 * @returns boolean
 */
export function isVerified(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		(session?.isOrg === false || session?.isOrganisationVerified == true)
	);
}

/**
 * Checks if the account is a verified organisation
 * @param session
 * @returns
 */
export function isVerifiedOrg(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		session?.isOrganisationVerified === true &&
		session?.isOrg === true
	);
}

/**
 * Checks if the account is a verified user
 * @param session
 * @returns
 */
export function isVerifiedUser(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		session?.isOrg === false
	);
}

/**
 * Check that if an account is of a required admin level
 * @param session
 * @param level
 * @returns
 */
export function isAdminLevel(session: any, level: number) {
	return (
		(isVerifiedUser(session) && session.adminLevel >= level) ||
		publicRuntimeConfig.IS_DEV === true
	);
}
