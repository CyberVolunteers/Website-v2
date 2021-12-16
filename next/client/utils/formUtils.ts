export function getFieldClasses(field: string, visitedFields: string[]) {
	return visitedFields.includes(field) ? "highlight-black" : "";
}

export function addVisitedField(
	field: string,
	visitedFields: string[],
	setVisitedFields: React.Dispatch<React.SetStateAction<string[]>>
) {
	if (visitedFields.includes(field)) return;
	setVisitedFields(visitedFields.concat([field]));

	// finally, change the actual value
	visitedFields.push(field);
}
