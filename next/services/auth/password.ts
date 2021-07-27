import { genSalt, hash as genHash, getRounds, compare } from "bcrypt";
import { minBcryptRounds } from "../config/server/password"

export async function hash(input: string) {
    const salt = await genSalt(minBcryptRounds);
    return await genHash(input, salt);
}

export async function verifyHash(inputHash: string, password: string, updateHashCallback: (newHash: string) => void) {
    console.log("verifyHash", inputHash, password)

    const isCorrectHash = await compare(password, inputHash);
    if (!isCorrectHash) return false;

    // if the hash it too weak, regenerate, but with the correct number of rounds
    if (getRounds(inputHash) < minBcryptRounds) {
        updateHashCallback(await hash(password));
    }

    return true;
}
