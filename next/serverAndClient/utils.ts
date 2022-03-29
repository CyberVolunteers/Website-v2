const postcodeRE =
	/^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

export function cleanPostcode(p: string) {
	return p.replaceAll(/[^0-9a-zA-Z]/g, "");
}
export function isPostcode(p: string): boolean {
	return postcodeRE.test(cleanPostcode(p));
}

export function getFileExtension(input: string) {
	const lastIndex = input.lastIndexOf(".");
	if (lastIndex === -1) return null;
	return input.slice(lastIndex);
}

export function isAllNonEmptyStrings(obj: { [key: string]: any }): boolean {
	return Object.values(obj).every((v) => typeof v === "string" && v !== "");
}
