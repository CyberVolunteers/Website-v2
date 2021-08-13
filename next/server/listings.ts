import { getMongo } from "./mongo";
import { Listing, Org } from "./mongo/mongoModels";
import sharp from "sharp";
import { baseListingImagePath } from "../serverAndClient/staticDetails";

export async function createListing(params: { [key: string]: any }, orgSession: { [key: string]: any }, fileExt: string, fileBuffer: Buffer) {
	const mongoConn = await getMongo();
	const createdDate = new Date();
	const org = orgSession._id;
	const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	const imagePath = baseListingImagePath + uniqueSuffix + fileExt;

	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, { createdDate, org, imagePath })

	const mongoSession = await mongoConn.startSession();

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