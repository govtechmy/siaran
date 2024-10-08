import { isAuthenticated } from "../utils/auth";
import { Endpoint } from "payload/config";
import { list } from "../controllers/api/press-releases";

export const endpoints: Endpoint[] = [
  {
    path: "/",
    method: "get",
    handler: isAuthenticated(list),
  },
];
