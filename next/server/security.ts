function trimDollarSigns(val: string): string {
	while (val.length !== 0 && val.charAt(0) === "$") {
		val = val.substring(1);
	}
	return val;
}

export function sanitiseForMongo<T>(val: T): T {
	if (typeof val !== "object" || val === null) return val;
	const out: any = (val instanceof Array) ? [] : {};
	Object.entries(val).forEach(([k, entry]) => {
		out[trimDollarSigns(k)] = sanitiseForMongo(entry);
	});

	return out as T;
}