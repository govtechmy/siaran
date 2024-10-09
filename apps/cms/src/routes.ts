import { Router } from "express";
import {
  list as listPressReleases,
  listByAgency as listPressReleasesByAgency,
} from "./controllers/api/press-releases";

const router = Router();

router.get("/press-releases", listPressReleases);
router.get("/press-releases/by-agency", listPressReleasesByAgency);

export default router;
