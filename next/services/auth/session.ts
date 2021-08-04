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

    storedInfo.isOrg = !doesEmailBelongToUser;

    return isCorrectHash && emailWasFound ? storedInfo._doc : false;
}

export async function signupUser(params: any) {
    const passwordHash = await hash(params.password);
    delete params.password;
    params.passwordHash = passwordHash;
    const newUser = new User(params);

    try {
        if (await isEmailFree(params.email) === false) throw new Error("This email is already used")
        await newUser.save()
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function signupOrg(params: any) {
    const passwordHash = await hash(params.password);
    delete params.password;
    params.passwordHash = passwordHash;
    const newUser = new Org(params);

    try {
        if (await isEmailFree(params.email) === false) throw new Error("This email is already used")
        await newUser.save()
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function isEmailFree(email: string) {
    // parallelise to make it as quick as possible

    async function failOnNoElements(p: Promise<any>) {
        const res = (await p);
        if (res === null) throw new Error("Email not found");
        return true;
    }

    try {
        await Promise.any([
            failOnNoElements(User.findOne({ email })),
            failOnNoElements(Org.findOne({ email }))
        ])
        return false;
    } catch {
        return true;
    }
}