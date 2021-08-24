import * as Iron from "@hapi/iron";

export async function seal(value: any) {
	if (process.env.IRON_KEY === undefined)
		throw new Error("Iron key is undefined");
	return await Iron.seal(value, process.env.IRON_KEY, Iron.defaults);
}

export async function unseal(value: string) {
	if (process.env.IRON_KEY === undefined)
		throw new Error("Iron key is undefined");
	return await Iron.unseal(value, process.env.IRON_KEY, Iron.defaults);
}
