import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isURL from "validator/lib/isURL";

export type ValidationMap = { [key: string]: (v: string) => boolean }

export const signupValidation: ValidationMap = {
	email: isEmail,
	phoneNumber: isMobilePhone,
	websiteUrl: isURL,
};

export function isValid(vals: { [key: string]: any }, validationMap: ValidationMap) {
	return Object.entries(vals).every(([k, v]) => {
		if (validationMap[k] === undefined) return true;
		return validationMap[k]("" + v);
	});
}
