// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { createAjvJTDSchema } from "combined-validator";
import { ajv, createHandler } from "../../../server/apiRequests";
import { getSession } from "../../../server/auth/auth-cookie";
import { isAdminLevel } from "../../../server/auth/session";
import { HandlerCollection } from "../../../server/types";
import { Listing, Org, User } from "../../../server/mongo/mongoModels";
import { logger } from "../../../server/logger";

export * from "../../../server/defaultEndpointConfig";

type Data = {
  name: string;
};

const handlers: HandlerCollection = {
  POST: async function (req, res) {
    const session = await getSession(req);

    if (!isAdminLevel(session, 3)) {
      logger.warn("server.admin_section_console.mongo.ts:Unauthorized");
      return res.status(400).send("Unauthorized");
    }
	
    let q1, q2, q3: any;
    try {
		q1 = JSON.parse(req.body?.query1);
    } catch {}
    try {
		q2 = JSON.parse(req.body?.query2);
    } catch {}
    try {
		q3 = JSON.parse(req.body?.query3);
    } catch {}
	logger.info("server.admin_section_console.mongo.ts:executing %s %s %s", q1, q2, q3);

    const model = (() => {
      switch (req.body?.model) {
        case "users":
          return User;
        case "orgs":
          return Org;
        default:
          return Listing;
      }
    })();
    const queryRes = await (async () => {
      switch (req.body?.type) {
        case "find":
          return await model.find(q1, q2, q3);
        case "delete_all": {
          const out = await model.deleteMany(q1, q2, q3);
          return [out, await model.find(q1)];
        }
        default: // update all
        {
          const out = await model.updateMany(q1, q2, q3);
          return [out, await model.find(q1)];
        }
      }
    })();

    return res.json(queryRes);
  },
};

export default async function mongo(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  await createHandler(
    handlers,
    {
      useCsrf: true,
    },
    {
      POST: ajv.compileParser(
        createAjvJTDSchema({
          required: {
            string: {
              query1: {},
              query2: {},
              query3: {},
              model: {},
              type: {},
            },
          },
        })
      ),
    }
  )(req, res);
}
