import { endpoints as searchEndpoints } from "./search";
import { endpoints as pressEndpoints } from "./press-releases";
export default [
  // Add more endpoints here
  ...searchEndpoints,
  ...pressEndpoints,
];
