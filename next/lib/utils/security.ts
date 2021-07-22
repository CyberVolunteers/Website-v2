export function deleteProto<T>(val: T) {
    if (!(val instanceof Object)) return val
    const out: any = val instanceof Array ? [] : {};
    Object.entries(val).forEach(([k, val]) => {
        out[k] = deleteProto(val);
    })

    return out as T
}