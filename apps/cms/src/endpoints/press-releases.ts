import { isAuthenticated } from "../utils/auth";
import { Endpoint } from "payload/config";
import { list }from "../controllers/api/press-releases"

export const endpoints: Endpoint[] = [
  {
    path: "/press-releases",
    method: "get",
    handler: isAuthenticated(list),
  },
];
