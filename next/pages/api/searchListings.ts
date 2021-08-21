// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler } from "../../server/apiRequests";
import { Listing } from "../../server/mongo/mongoModels";
import { toStrippedObject } from "../../server/mongo/util";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { searchListingsSpec } from "../../serverAndClient/publicFieldConstants";
import { getLatAndLong } from "../../server/location";

export * from "../../server/defaultEndpointConfig";

type Data = {
  name: string;
};

const handlers: HandlerCollection = {
  GET: async function (req, res) {
    logger.info("server.searchListings: %s", req.query);
    const { keywords, targetLoc, category, minHours, maxHours, isOnline } =
      req.query;

    const searchObj1 = {} as { [key: string]: any };
    const searchObj2 = {} as { [key: string]: any };

    // Pre-checks
    if (
      typeof targetLoc === "string" &&
      typeof isOnline !== "undefined" &&
      isOnline === "true"
    )
      return res
        .status(400)
        .send(
          "Please make sure to include offline searches when sorting by location."
        );

    // keywords
    if (keywords !== "" && typeof keywords === "string") {
      searchObj1.$text = { $search: keywords };
      searchObj2.textScore = { $meta: "textScore" };
    }

    if (typeof minHours === "string") {
      const minHoursFloat = parseFloat(minHours);
      if (!isNaN(minHoursFloat))
        searchObj1.maxHoursPerWeek = { $gte: minHoursFloat };
    }

    if (typeof maxHours === "string") {
      const maxHoursFloat = parseFloat(maxHours);
      if (!isNaN(maxHoursFloat))
        searchObj1.minHoursPerWeek = { $lte: maxHoursFloat };
    }

    if (typeof isOnline !== "undefined") {
      searchObj1["location.isOnline"] = isOnline === "true";
    }

    if (typeof category === "string") {
      searchObj1.category = category;
    }

    let latLongPair: [lat: number, long: number] | [] = [];

    // check beforehand
    if (typeof targetLoc === "string") {
      // find the location
      latLongPair = await getLatAndLong(targetLoc + ", UK");
      if (latLongPair?.[0] === undefined)
        return res
          .status(400)
          .send(
            "Sorry, we could not find this location. There is a greater chance of this working with an address"
          );
    }

    // the actual search
    let listings = await Listing.find(searchObj1, searchObj2).populate(
      "organisation"
    );

    let distances: { distance: number }[] = [];

    if (typeof targetLoc === "string") {
      const ids = listings.map((l: any) => l._id);
      // search for distances
      distances = await Listing.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: latLongPair },
            distanceField: "distance",
            query: {
              _id: { $in: ids },
              "location.isOnline": false,
            },
          },
        },
        {
          $project: { distance: 1, uuid: 1, _id: 0 },
        },
      ]);
    }

    listings = listings.map((l: any) => ({
      maxHoursPerWeek: l.maxHoursPerWeek,
      minHoursPerWeek: l.minHoursPerWeek,
      imagePath: l.imagePath,
      title: l.title,
      organisationName: l.organisation?.orgName,
      desc: l.desc,
      currentVolunteers: l.currentNumVolunteers,
      requestedVolunteers: l.requestedNumVolunteers,
      uuid: l.uuid,
      textScore: l._doc.textScore, // for some weird reason has to be accessed through _doc and not directly
    }));

    return res.json({
      listings,
      distances,
    });
  },
};

export default async function searchListings(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  await createHandler(
    handlers,
    {
      useCsrf: false,
    },
    undefined,
    {
      GET: searchListingsSpec,
    }
  )(req, res);
}
