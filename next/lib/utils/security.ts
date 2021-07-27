export function mergeWithCallback<T>(val: T, callback: (k: string, v: T) => [k: string, v: T]) {
    if ((val as any).constructor?.name !== "object" && !Array.isArray(val)) return val // check if we want to recurse

    const out: any = (val instanceof Array) ? [] : {};
    Object.entries(val).forEach(([k, v]) => {
        const [newK, newV] = callback(k, v);
        out[newK] = mergeWithCallback(newV, callback);
    })

    return out as T
}

function trimDollarSigns(val: string) {
    while (val.length !== 0 && val.charAt(0) === "$") {
        val = val.substring(1);
    }
    return val
}

export function sanitiseForMongo<T>(val: T) {
    if (typeof val !== "object" || val === null) return val
    const out: any = (val instanceof Array) ? [] : {};
    Object.entries(val).forEach(([k, entry]) => {
        out[trimDollarSigns(k)] = sanitiseForMongo(entry);
    })

    return out as T
}