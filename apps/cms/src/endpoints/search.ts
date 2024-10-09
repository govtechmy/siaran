import { isAuthenticated } from "../utils/auth";
import { Endpoint } from "payload/config";
import { searchAll as searchAllCollections } from "../controllers/api/search-collections";

export const endpoints: Endpoint[] = [
  {
    path: "/search",
    method: "get",
    handler: isAuthenticated(searchAllCollections),
  },
];
