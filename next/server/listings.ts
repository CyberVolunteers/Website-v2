import { Listing, Org } from "./mongo/mongoModels";
import sharp from "sharp";
import { baseListingImagePath } from "../serverAndClient/staticDetails";
import { v4 as uuidv4 } from "uuid";
import { connection } from "mongoose";

export async function createListing(params: { [key: string]: any }, orgSession: { [key: string]: any }, fileExt: string, fileBuffer: Buffer) {
	const createdDate = new Date();
	const organisation = orgSession._id;
	const uuid = uuidv4();
	const imagePath = baseListingImagePath + uuid + fileExt;

	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, { createdDate, organisation, imagePath, uuid, users: [] }) //TODO: check if this leaks when listings are queried

	const mongoSession = await connection.startSession();

	await mongoSession.withTransaction(async () => {
		const newListing = new Listing(dataToSupply);
		await Promise.all([
			sharp(fileBuffer).resize({ width: 1024 }).toFile(process.env.baseDir + "/public" + imagePath),
			newListing.save(),
			// add the new id to the organisation
			Org.updateOne(
				{ _id: orgSession._id },
				{ $push: { listings: newListing._id } }
			)
		])

	})//.catch((e) => {
	// 	console.error(e);
	// 	throw e;
	// });

	mongoSession.endSession()
}