import { MutableRefObject } from "react";
import zxcvbn from "zxcvbn"
import { PerElementValidatorCallback } from "../client/components/FormComponent";
import { minPasswordScore } from "./staticDetails";

const dayLength = 24 * 60 * 60 * 1000;
export function isDateInPast(v: string) {
	const date = new Date(v);
	const currentDate = new Date();


	// see if it an invalid date
	if (isNaN(date.getDay())) return false;

	// the actual check
	const timeDifference = currentDate.getTime() - date.getTime();

	const isToday = (timeDifference < dayLength && currentDate.getDate() === date.getDate());

	// it can be the same day, just later on in the day
	if (timeDifference > 0 && !isToday) return true;
	else {
		return "Please specify a time in the past";
	}
}

export function isNonNegative(v: string){
	const int = parseInt(v);
	if(isNaN(int)) return false;
	return int >= 0;
}

export function passwordStrengthSuggestions(p: string){
	const result = zxcvbn(p);
	const score = result.score;
	if(score >= minPasswordScore) return true;
	const base = ["A very weak password", "A weak password", "A medium password", "A strong password", "A very strong password"][score] + ". "

	const feedback = result.feedback;
	const warning = feedback.warning === "" ? "" : `Warning: ${feedback.warning}. `;
	const suggestions = feedback.suggestions.length === 0 ? "" : `Optional suggestions: ${feedback.suggestions.join(", ")} `;
	
	return base + warning + suggestions;
}

export const passwordEquality: PerElementValidatorCallback= (password2, root) => {
	const password1 = root.getChild("password").formState;
	return password1 === password2 ? true : "The two passwords do not match";
}
