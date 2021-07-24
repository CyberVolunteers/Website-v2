import { verifyHash } from "./password"
import { Org, User } from "../mongo/mongoModels"
import { copyMongoKeys, getMongo } from "../mongo";
import { UserSchema } from "../mongo/mongoSchemas";

export async function login(email: string, password: string) {
    const mongo = await getMongo(); // connect

    // find instead of findOne to keep the time roughly constant relative to when there are no results
    const [users, organisations] = await Promise.all([
        User.find({ email }),
        Org.find({ email })
    ])

    const emailWasFound = users.length !== 0 || organisations.length !== 0;
    const doesEmailBelongToUser = users.length !== 0;
    const storedCreds = emailWasFound ?
        doesEmailBelongToUser ? users[0] : organisations[0]
        : {
            passwordHash: "this should never match" // a dummy object for timing attacks
        }

    const isCorrectHash = await verifyHash(password, storedCreds.passwordHash, (newHash) => {
        const schema = doesEmailBelongToUser ? User : Org;
        schema.updateOne({ email }, { passwordHash: newHash })
    });

    return isCorrectHash && emailWasFound;
}

export async function signupUser(params: any) {
    // const newUser = new User(copyMongoKeys(UserSchema, params));
    // await newUser.save();
}