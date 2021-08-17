import { Listing, Org } from "./mongo/mongoModels";
import sharp from "sharp";
import { baseListingImagePath } from "../serverAndClient/staticDetails";
import { v4 as uuidv4 } from "uuid";
import { connection } from "mongoose";
import { logger } from "./logger";
import { getLatAndLong } from "./location";

export async function createListing(params: { [key: string]: any }, orgSession: { [key: string]: any }, fileExt: string, fileBuffer: Buffer) {
	const createdDate = new Date();
	const organisation = orgSession._id;
	const uuid = uuidv4();
	const imagePath = baseListingImagePath + uuid + fileExt;

	const address = params.location;
	console.log(params)

	const geocodingString = [address.place, address.street, address.city, address.county, "UK"].join(", ");

	const location = await getLatAndLong(geocodingString);
	console.log(location)

	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, { createdDate, organisation, imagePath, uuid, users: [] }) //TODO: check if this leaks when listings are queried

	try {
		await connection.transaction(async () => {
			const newListing = new Listing(dataToSupply);
			await sharp(fileBuffer).resize({ width: 1024 }).toFile(process.env.baseDir + "/public" + imagePath);
			await newListing.save();
			// add the new id to the organisation
			await Org.updateOne(
				{ _id: orgSession._id },
				{ $push: { listings: newListing._id } }
			)
		})
	} catch (e) {
		logger.error("server.listings:Error creating a listing: '%s'", e);
		return false;
	}
	return true;
}
