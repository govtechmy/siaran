import payload from "payload";
import { Endpoint } from "payload/config";
import PressRelease from "../collections/PressRelease";
import * as fields from "../collections/fields/press-release";
import { isAuthenticated } from "../utils/auth";

export const endpoints: Endpoint[] = [
  {
    path: "/search/press-releases",
    method: "get",
    handler: isAuthenticated(async function handler(req, res) {
      const query = req.query.q;
      const result = await payload.db.collections[PressRelease.slug].aggregate([
        {
          $match: {
            $and: [
              {
                $text: {
                  $search: (query || "") as string,
                },
              },
              {
                $expr: {
                  $lt: [
                    "$" + fields.datePublished,
                    { $toDate: new Date().toISOString() },
                  ],
                },
              },
            ],
          },
        },
        {
          $limit: 10,
        },
      ]);

      return res.status(200).send({
        docs: result.map((item) => ({
          ...item,
          id: item["_id"],
        })),
      });
    }),
  },
];
