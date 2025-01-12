import payload from "payload";
import { Endpoint } from "payload/config";
import { isAuthenticated } from "../utils/auth";

export const endpoints: Endpoint[] = [
  {
    path: "/search/press-releases",
    method: "get",
    handler: isAuthenticated(async function handler(req, res) {
      const result = await payload.find({
        collection: "press-releases",
        where: {
          or: [
            {
              ["title"]: {
                contains: req.query.q || "",
              },
            },
          ],
        },
        limit: 10,
      });

      return res.status(200).send(result);
    }),
  },
];
