import { PreMiddlewareFunction } from "mongoose"

export const stringValidate = {

    exactLength: createValidation("This string field size does not match the required size", (value: string, length: number) => value.length == length),
    maxLength: createValidation("This string field is too long", (value: string, length: number) => value.length <= length),
}

export const numberValidate = {
    greaterOrEqualTo: createValidateMiddleware("The fields need to be in descending order or equal", false, isAscendingOrder)
}

function isAscendingOrder(obj: any, resolvedFields: any[]) {
    return resolvedFields.every((value: any, index: number) => {
        return index == resolvedFields.length - 1 || value >= resolvedFields[index + 1]
    })
}


// "current" means that those values are no longer general
function createValidation<T>(message: string, validate: (toCheck: T, ...referenceVals: any[]) => boolean) {
    return function (...currentReferenceVals: any[]) {
        return {
            message,
            validator: (value: T) => validate.apply(null, [value, ...currentReferenceVals])
        }
    }
}

function createValidateMiddleware(message: string, automaticResponseToUndefined: boolean | null, callback: (toValidate: any, resolvedFields: any[], fields: any[]) => boolean) {
    return function (fields: any[]) {
        const out: PreMiddlewareFunction<any> = function (next) {
            const resolvedFields = fields.map((k) => this[k]);

            const hasSucceeded = automaticResponseToUndefined !== null && resolvedFields.some((k) => k === undefined) ? // if has undefined fields and we need to care about them,
                automaticResponseToUndefined : // return the pre-defined value
                callback(this, resolvedFields, fields); // else, validate
            if (hasSucceeded) return next();
            throw new Error(`${message}; Fields for validation: ${fields}`);
        }
        return out;
    }
}