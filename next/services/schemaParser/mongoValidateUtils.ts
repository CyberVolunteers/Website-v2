import { PreMiddlewareFunction } from "mongoose"

export function isDescendingOrder(resolvedFields: any[]) {
    return resolvedFields.every((value: any, index: number) => {
        return index == resolvedFields.length - 1 || value >= resolvedFields[index + 1]
    })
}

export const isExactLength = (value: string, length: number) => value.length == length;
export const isMaxLength = (value: string, length: number) => value.length <= length;

export const stringValidate = {

    exactLength: createValidation("This string field size does not match the required size", isExactLength),
    maxLength: createValidation("This string field is too long", isMaxLength),
}

export const numberValidate = {
    greaterOrEqualTo: createValidateMiddleware("The fields need to be in descending order or equal", false, isDescendingOrder)
}



// "current" means that those values are no longer general
export function createValidation<T>(message: string, validate: (toCheck: T, ...referenceVals: any[]) => boolean) {
    return function (...currentReferenceVals: any[]) {
        return {
            message,
            validator: (value: T) => validate.apply(null, [value, ...currentReferenceVals])
        }
    }
}

export function createValidateMiddleware(message: string, automaticResponseToUndefined: boolean | null, callback: (resolvedFields: any[], toValidate: any, fields: any[]) => boolean) {
    return function (fields: any[]) {
        const out: PreMiddlewareFunction<any> = function (next) {
            const resolvedFields = fields.map((k) => this[k]);

            const hasSucceeded = automaticResponseToUndefined !== null && resolvedFields.some((k) => k === undefined) ? // if has undefined fields and we need to care about them,
                automaticResponseToUndefined : // return the pre-defined value
                callback(resolvedFields, this, fields); // else, validate
            if (hasSucceeded) return next();
            throw new Error(`${message}; Fields for validation: ${fields}`);
        }
        return out;
    }
}