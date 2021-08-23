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
    Org.find({ email }),
  ]);

  const emailWasFound = users.length !== 0 || organisations.length !== 0;
  const doesEmailBelongToUser = emailWasFound && users.length !== 0;
  const storedInfo = emailWasFound
    ? doesEmailBelongToUser
      ? users[0]._doc
      : organisations[0]._doc
    : {
        passwordHash: "this should never match", // a dummy "hash" against timing attacks
      };

  logger.info(
    "server.auth.session:Login db retrieval success: %s",
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

export async function signupUser(params: any) {
  const passwordHash = await hash(params.password);
  delete params.password;
  params.passwordHash = passwordHash;
  const newUser = new User(params);

  if ((await isEmailFree(params.email)) === false) {
    logger.info("server.auth.session:Email used for user");

    return false;
  }

  await newUser.save();
  return true;
}

export async function signupOrg(params: any) {
  const passwordHash = await hash(params.password);
  delete params.password;
  params.passwordHash = passwordHash;
  const newUser = new Org(params);

  if ((await isEmailFree(params.email)) === false) {
    logger.info("server.auth.session:Email used for user");
    return false;
  }
  await newUser.save();
  return true;
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
      failOnNoElements(Org.findOne({ email })),
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
  return await updateData(data, email, User);
}

export async function updateOrgData(
  data: any,
  email: string
): Promise<{ [key: string]: any } | null> {
  return await updateData(data, email, Org);
}

async function updateData(
  data: any,
  email: string,
  model: typeof User | typeof Org | typeof Listing,
): Promise<{ [key: string]: any } | null> {
  let doc = await model.findOneAndUpdate({ email }, data, {
    new: true,
    upsert: false, // do not create a new one
  });
  return doc;
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

  return out;
}

export function isLoggedIn(session: any) {
  return typeof session?.email === "string";
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
