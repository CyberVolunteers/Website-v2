import multer from "multer";
import { createAjvJTDSchema, deepAssign } from "combined-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { ajv, createHandler, runMiddleware, verifyJSONShape } from "../../server/apiRequests";
import { getSession } from "../../server/auth/auth-cookie";
import { isOrg } from "../../server/auth/session";
import { createListing } from "../../server/listings";
import { HandlerCollection, MulterReq } from "../../server/types";
import { listings } from "../../serverAndClient/publicFieldConstants";
import { getFileExtension } from "../../serverAndClient/utils";
import { allowedFileTypes } from "../../serverAndClient/staticDetails";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}


const listingImageStorage = multer.memoryStorage();


const upload = multer({
	storage: listingImageStorage,
	limits: {
		fields: 20,
		fileSize: 512 * 1024 * 1024,
		files: 1
	}
});
const bodyParser = ajv.compileParser(createAjvJTDSchema(deepAssign(listings, {
	required: {
		string: {
			// eslint-disable-next-line
			//@ts-ignore
			imagePath: undefined, // delete the image path from user input
			// eslint-disable-next-line
			//@ts-ignore
			uuid: undefined // delete the uuid from user input
		}
	}
})));

const handlers: HandlerCollection = {
	POST: async function (req: MulterReq, res) {
		await runMiddleware(req, res, upload.single("listingImage") as any);

		const file = req.file;
		if (file === undefined) return res.status(400).send("Please send us an image file");

		//IMPORTANT: do not forget to check the json shape as well
		if (verifyJSONShape(req, res, bodyParser) === false) return;

		const session = await getSession(req);

		if (!isOrg(session)) return res.status(403).send("You need to be an organisation to do that");

		const fileExt = getFileExtension(file.originalname);
		if (fileExt === null || !allowedFileTypes.includes(fileExt)) return res.status(400).send("Please upload a valid image file");

		await createListing(req.body, session, fileExt, file.buffer);

		return res.end();
	}
};

export default async function createListingRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers,
		{
			useCsrf: true,
			allowFiles: true
		},
		{
			POST: bodyParser
		})(req, res);
}
