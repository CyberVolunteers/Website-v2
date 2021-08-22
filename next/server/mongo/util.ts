// eslint-disable-next-line
//@ts-ignore
import ObjectId from "mongoose/lib/types/objectid";

// NOTE: Removes some unwanted keys, but do double-check them!
export function toStrippedObject(obj: any){
	return obj.toJSON({
		versionKey: false,
		transform: (doc: any, out: any) => {
			Object.keys(out).forEach(k => {
				if (out[k] instanceof ObjectId) delete out[k]; // delete all the id keys
				if (k[0] === "_") delete out[k]; // delete all the underscore keys
				if (out[k] instanceof Date) out[k] = out[k].toISOString(); // delete all the id keys
			});
			return out;
		}
	});
}