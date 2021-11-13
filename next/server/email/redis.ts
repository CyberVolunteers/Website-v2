import { fixedTimeComparison } from "@hapi/cryptiles";
import redis from "redis";
import { logger } from "../logger";
import { cacheExpirationSeconds, expireTimeSecondsByStore } from "./config";

const client = redis.createClient(6379, "redis");

export type RedisUUIDStores = "emailConfirmUUID" | "passwordResetUUID";
export type RedisCacheStores = "postcodeAddress";

//TODO: test if it is removed
export async function addTempKey(k: string, v: string, store: RedisUUIDStores) {
	await hset(k, v, store);
	// TODO: this is broken
	// await expire(k, store);
}

async function hset(k: string, v: string, store: RedisUUIDStores) {
	return new Promise<number>((res, rej) => {
		client.hset(store, k, v, resolver(res, rej));
	});
}

async function expire(k: string, store: RedisUUIDStores) {
	return new Promise<number>((res, rej) => {
		client.expire(k, expireTimeSecondsByStore[store], resolver(res, rej));
	});
}

export async function getKey(k: string, store: RedisUUIDStores) {
	return new Promise<string | undefined>((res, rej) => {
		client.hget(store, k, resolver(res, rej));
	});
}

function resolver<T>(res: (value: T) => void, rej: (reason?: any) => void) {
	return (err: Error | null, v: T) => {
		if (err) return rej(err);
		return res(v);
	};
}

/**
 * checks if the uuid is correct
 * @param key the key under which the uuid was stored
 * @param uuid the uuid to check
 * @param store the name of the store
 * @returns boolean
 */
export async function verifyUUID(
	key: string,
	uuid: string,
	store: RedisUUIDStores
): Promise<boolean> {
	const storedUUIDRaw = await getKey(key, store);
	const storedUUID =
		storedUUIDRaw ?? "this should not be matched under any circumstances";

	// always do this so that the timing is the same
	const comparisonResult = fixedTimeComparison(uuid, storedUUID);

	// if there hasn't been a request to verify the email,
	if (storedUUIDRaw === undefined) return false;
	else return comparisonResult;
}

export async function cacheQuery(
	key: string,
	store: RedisCacheStores,
	getValue: (key: string) => Promise<string | Object>
): Promise<string> {
	return new Promise((res, rej) => {
		// prefix the key with the store name to prevent collisions
		// TODO: see if there is a better way
		const compoundKey = store + key;

		client.get(compoundKey, (err, storedValue) => {
			if (err !== null) throw err;
			// if found, return the value
			if (typeof storedValue === "string") return res(storedValue);

			// else, calculate the value and store it
			getValue(key).then((rawValue) => {
				const value =
					typeof rawValue === "string" ? rawValue : JSON.stringify(rawValue);

				// remember the value
				client.setex(
					compoundKey,
					cacheExpirationSeconds[store],
					value,
					(err) => {
						if (err !== null) throw err;
					}
				);
				return res(value);
			});
		});
	});
}
