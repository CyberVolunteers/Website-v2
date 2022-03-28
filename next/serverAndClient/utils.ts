export function getFileExtension(input: string) {
	const lastIndex = input.lastIndexOf(".");
	if (lastIndex === -1) return null;
	return input.slice(lastIndex);
}
