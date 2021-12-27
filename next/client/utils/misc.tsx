import { capitalize } from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import { error } from "./logger";

export function doEllipsis(text: string, maxLength: number) {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + "...";
}

export function undoCamelCase(s: string) {
	let out = s.replace(/([A-Z])/g, " $1"); // add a space before all the capital letters
	out = out.replace(/([0-9]+)/g, " $1"); // add a space before digits
	out = out.toLowerCase();
	return out;
}

async function createErrorMessage(resStatus: number, resContents: string) {
	// it is a separate function to account for a possible improvement
	return capitalize(
		`${resStatus >= 500 ? "server " : ""}error: ${resContents}`
	);
}

export async function updateOverallErrorsForRequests(
	res: Response,
	thisId: string,
	overallErrors: {
		[key: string]: string;
	},
	setOverallErrors: Dispatch<
		SetStateAction<{
			[key: string]: string;
		}>
	>
) {
	const overallErrorsCopy = Object.assign({}, overallErrors); // so that when react compares the previous and the current value, it does not find them to be the same
	if (res.status >= 400) {
		const resContents = await res.text();
		overallErrorsCopy[thisId] = await createErrorMessage(
			res.status,
			resContents
		);
		setOverallErrors(overallErrorsCopy);
		error(
			"misc",
			`updateOverallErrorsForRequests: failed with text "${resContents}", status: ${res.status}, statusText: ${res.statusText}`
		);
		return false;
	}
	return true;
}

export function cleanStylisedText(text: string, keepMinimal?: true) {
	if (keepMinimal) text = text.replaceAll(/\n/g, "");

	return text
		.replaceAll(/^(\n)+/g, "")
		.replaceAll(/(\n)+$/g, "")
		.replaceAll("<b>", "")
		.replaceAll("</b>", "");
}
export function handleStylisedTextRender(text: string, keepMinimal?: true) {
	text = cleanStylisedText(text, keepMinimal);
	return (
		<>
			{capitalize(text)
				.split("\n")
				.map((t, i) => {
					// TODO: also do bold tags
					return (
						<span key={i}>
							{t}
							<br />
						</span>
					);
				})}
		</>
	);
}

export async function wait(time: number): Promise<void> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res();
		}, time);
	});
}
