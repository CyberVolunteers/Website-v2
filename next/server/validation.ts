import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isURL from "validator/lib/isURL";

export type ValidationMap = { [key: string]: (v: string) => boolean };

/**
 * Checks that all keys that are both in the object and the validation map obey the rules of the validation map
 * @param vals an input object (not all keys have to be in the validation map)
 * @param validationMap rules for validation
 * @returns boolean if all applicable rules are satisfied
 */
export function doAllRulesApply(
	vals: { [key: string]: any },
	validationMap: ValidationMap
) {
	return Object.entries(vals).every(([k, v]) => {
		if (validationMap[k] === undefined) return true;
		return validationMap[k]("" + v);
	});
}
