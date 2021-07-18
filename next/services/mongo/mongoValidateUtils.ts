export const stringValidate = {

    exactLength: createValidation("This string field size does not match the required size", (value: string, length: number) => value.length == length),
    maxLength: createValidation("This string field is too long", (value: string, length: number) => value.length <= length)
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