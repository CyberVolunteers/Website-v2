import { hash, verifyHash } from "./password";
import { Listing, Org, User } from "../mongo/mongoModels";
import getConfig from "next/config";
import { logger } from "../logger";

const { publicRuntimeConfig } = getConfig();

export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	// find instead of findOne to keep the time roughly constant relative to when there are no results
	const [users, organisations] = await Promise.all([
		User.find({ email }),
		Org.find({ "creds.email": email }),
	]);

	const emailWasFound = users.length !== 0 || organisations.length !== 0;
	const doesEmailBelongToUser = organisations.length === 0;

	let storedInfo = emailWasFound
		? doesEmailBelongToUser
			? users[0]
			: organisations[0]
		: {
				passwordHash: "this should never match", // a dummy "hash" against timing attacks
		  };

	// prepare it for the future access
	storedInfo = extractData(storedInfo, email);

	logger.info(
		"server.auth.session:Were login credentials found in the db?: %s",
		emailWasFound
	);

	const isCorrectHash = await verifyHash(
		password,
		storedInfo.passwordHash,
		(newHash) => {
			const schema = doesEmailBelongToUser ? User : Org;
			schema.updateOne({ email }, { passwordHash: newHash });
		}
	);

	storedInfo.isOrg = !doesEmailBelongToUser;

	return isCorrectHash && emailWasFound ? storedInfo : false;
}

declare type Creds = {
	email: string;
	passwordHash: string;
	isEmailVerified: boolean;
};

function extractOrgData(user: any, targetEmail: string) {
	logger.info("server.auth.data: Extracting org data from %s", user);
	// must be only one set of credentials
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

export function extractData(data: any, email: string | null) {
	if (data === null) return;
	data = data._doc ?? data;
	// see if it is a user and not a random piece of data
	// const isUser = data.lastName !== undefined;
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

export async function signupUser(params: any) {
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

export async function signupOrg(params: any) {
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

export async function isEmailFree(email: string) {
	// parallelize to make it as quick as possible

	async function failOnNoElements(p: Promise<any>) {
		const res = await p;
		if (res === null) throw new Error("Email not found");
		return true;
	}

	try {
		await Promise.any([
			failOnNoElements(User.findOne({ email })),
			failOnNoElements(Org.findOne({ "creds.email": email })),
		]);
		return false;
	} catch {
		return true;
	}
}

export async function updateUserData(
	data: any,
	email: string
): Promise<{ [key: string]: any } | null> {
	return await updateData(data, { email }, User);
}

export async function updateOrgData(
	data: any,
	email: string
): Promise<{ [key: string]: any } | null> {
	return await updateData(data, { "creds.email": email }, Org, email);
}

export async function updateListingData(
	data: any,
	orgId: string,
	uuid: string
): Promise<{ [key: string]: any } | null> {
	return await updateData(data, { organisation: orgId, uuid }, Listing);
}

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
				newData["$set"] = newData["$set"] ?? {};
				newData["$set"][`creds.$.${k}`] = v;
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

export async function setEmailAsVerified(email: string) {
	return await changeByEmail(email, {
		isEmailVerified: true,
	});
}

export async function setPassword(email: string, password: string) {
	const passwordHash = await hash(password);
	return await changeByEmail(email, {
		passwordHash,
	});
}

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

export function isLoggedIn(session: any) {
	return typeof session?.email === "string";
}

export function isVerified(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		(session?.isOrg === false || session?.isOrganisationVerified == true)
	);
}

export function isOrg(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		session?.isOrganisationVerified === true &&
		session?.isOrg === true
	);
}

export function isUser(session: any) {
	return (
		isLoggedIn(session) &&
		session?.isEmailVerified === true &&
		session?.isOrg === false
	);
}

export function isAdminLevel(session: any, level: number) {
	return (
		(isLoggedIn(session) && session.adminLevel >= level) ||
		publicRuntimeConfig.IS_DEV === true
	);
}
