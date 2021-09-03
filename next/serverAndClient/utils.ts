import { Flattened } from "combined-validator";

export function getFileExtension(input: string) {
	const lastIndex = input.lastIndexOf(".");
	if (lastIndex === -1) return null;
	return input.slice(lastIndex);
}

// TODO: make sure this is everywhere
export function prepareFormState(
	input: { [key: string]: any },
	schema: Flattened
): { [key: string]: any } {
	const out = {} as { [key: string]: any };
	Object.entries(input).forEach(([k, v]) => {
		if (v === ("" as any)) return;

		const type = schema[k]?.type;

		// check if it is a date
		if (schema[k]?.type === "date") v = new Date(v ?? "").toISOString();

		if (
			typeof v === "object" &&
			v !== undefined &&
			v !== null &&
			typeof type !== "string"
		)
			out[k] = prepareFormState(v, type ?? ({} as Flattened));
		else out[k] = v;
	});
	return out;
}
