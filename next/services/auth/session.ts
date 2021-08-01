import { hash, verifyHash } from "./password"
import { Org, User } from "../mongo/mongoModels"

export async function login({ email, password }: { email: string, password: string }) {
    // find instead of findOne to keep the time roughly constant relative to when there are no results
    const [users, organisations] = await Promise.all([
        User.find({ email }),
        Org.find({ email })
    ])

    const emailWasFound = users.length !== 0 || organisations.length !== 0;
    const doesEmailBelongToUser = emailWasFound && users.length !== 0;
    const storedInfo = emailWasFound ?
        doesEmailBelongToUser ? users[0] : organisations[0]
        : {
            passwordHash: "this should never match" // a dummy "hash" against timing attacks
        }

    const isCorrectHash = await verifyHash(password, storedInfo.passwordHash, (newHash) => {
        const schema = doesEmailBelongToUser ? User : Org;
        schema.updateOne({ email }, { passwordHash: newHash })
    });

    return isCorrectHash && emailWasFound ? storedInfo : false;
}

export async function signupUser(params: any) {
    const passwordHash = await hash(params.password);
    delete params.password;
    params.passwordHash = passwordHash;
    const newUser = new User(params);

    try {
        await newUser.save()
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}