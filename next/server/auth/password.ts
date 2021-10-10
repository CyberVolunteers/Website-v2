import { genSalt, hash as genHash, getRounds, compare } from "bcrypt";
import { logger } from "../logger";
import { minBcryptRounds } from "./config";

export async function hash(input: string) {
	const salt = await genSalt(minBcryptRounds);
	return await genHash(input, salt);
}

/**
 * verifies that the password is correct by looking at its hash, while providing a way to update the hash if it is less secure than expected
 * @param password the password to check
 * @param inputHash the hash to compare against
 * @param updateHashCallback 
 * @returns 
 */
export async function verifyHash(
	password: string,
	inputHash: string,
	updateHashCallback: (newHash: string) => void | Promise<void>
) {
	const isCorrectHash = await compare(password, inputHash);
	if (!isCorrectHash) return false;

	// if the hash it too weak, regenerate, but with the correct number of rounds
	if (getRounds(inputHash) < minBcryptRounds) {
		logger.info("server.auth.password:Upgrading password complexity");
		await updateHashCallback(await hash(password));
	}

	return true;
}
