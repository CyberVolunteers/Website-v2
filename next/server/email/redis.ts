import { fixedTimeComparison } from "@hapi/cryptiles";
import redis from "redis";
import { expireTimeSecondsByStore } from "./config";

const client = redis.createClient(6379, "redis");

export type RedisStores = "emailConfirmUUID" | "passwordResetUUID";

export async function addTempKey(k: string, v: string, store: RedisStores) {
	await hset(k, v, store,);
	await expire(k, store);
}

async function hset(k: string, v: string, store: RedisStores) {
	return new Promise<number>((res, rej) => {
		client.hset(store, k, v, resolver(res, rej));
	});
}

async function expire(k: string, store: RedisStores) {
	return new Promise<number>((res, rej) => {
		client.expire(k, expireTimeSecondsByStore[store], resolver(res, rej));
	});
}

export async function getKey(k: string, store: RedisStores) {
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

export async function verifyUUID(key: string, uuid: string, store: RedisStores){
	const storedUUIDRaw = await getKey(key, store);
	const storedUUID = storedUUIDRaw ?? "";

	// always do this so that the timing is the same
	const comparisonResult = fixedTimeComparison(uuid, storedUUID);

	// if there hasn't been a request to verify the email,
	if (storedUUIDRaw === undefined) return false;
	else return comparisonResult;
}