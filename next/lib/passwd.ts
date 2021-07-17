import { genSalt, hash as genHash, getRounds, compare } from "bcrypt";
import { minBcryptRounds } from "../lib/config"

export const hash = async function (input: string) {
    const salt = await genSalt(minBcryptRounds);
    return await genHash(input, salt);
}

export const verifyHash = async function (inputHash: string, password: string, updateHashCallback: (newHash: string) => void) {

    const isCorrectHash = await compare(password, inputHash);
    if (!isCorrectHash) return false;

    // if the hash it too weak, regenerate, but with the correct number of rounds
    if (getRounds(inputHash) < minBcryptRounds) {
        updateHashCallback(await hash(password));
    }

    return true;
}
