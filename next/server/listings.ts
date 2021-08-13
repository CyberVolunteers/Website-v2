import { getMongo } from "./mongo";
import { Listing, Org } from "./mongo/mongoModels";
import sharp from "sharp";
import { baseListingImagePath } from "../serverAndClient/staticDetails";

export async function createListing(params: { [key: string]: any }, orgSession: { [key: string]: any }, fileExt: string, fileBuffer: Buffer) {
	const mongoConn = await getMongo();
	const createdDate = new Date();
	const org = orgSession._id;
	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, { createdDate, org })

	const mongoSession = await mongoConn.startSession();

	await mongoSession.withTransaction(async () => {
		const newListing = new Listing(dataToSupply);
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const filePath = process.env.baseDir + "/public" + baseListingImagePath + uniqueSuffix + fileExt;
		await Promise.all([
			sharp(fileBuffer).resize({ width: 1024 }).toFile(filePath),
			newListing.save(),
			// add the new id to the organisation
			Org.updateOne(
				{ _id: orgSession._id },
				{ $push: { listings: newListing._id } }
			)
		])

	});

	mongoSession.endSession()
}