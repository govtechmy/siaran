import { Router } from "express";
import {
  list as listPressReleases,
  listByAgency as listPressReleasesByAgency,
} from "./controllers/api/press-releases";
import { agencyList } from "./controllers/api/agencies";

const router = Router();

router.get("/press-releases", listPressReleases);
router.get("/press-releases/by-agency", listPressReleasesByAgency);
router.get("/agencies", agencyList);

export default router;
