import { verifyHash } from "./password"
import { Org, User } from "../mongo/mongoModels"

export async function login(email: string, password: string) {
    // find instead of findOne to keep the time roughly constant relative to when there are no results
    const [users, organisations] = await Promise.all([
        User.find({ email }),
        Org.find({ email })
    ])

    console.log(users, organisations)
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

}