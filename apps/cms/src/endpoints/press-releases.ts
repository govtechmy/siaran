import { isAuthenticated } from "../utils/auth";
import { Endpoint } from "payload/config";
import { list, insertManyPressReleases } from "../controllers/api/press-releases";

export const endpoints: Endpoint[] = [
  {
    path: "/v1/press-releases",
    method: "get",
    handler: isAuthenticated(list),
  },
  {
    path: "/v1/press-releases",
    method: "post",
    handler: isAuthenticated(insertManyPressReleases),
  },
];
