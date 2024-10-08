import { Router } from "express";
import { agencyList } from "./controllers/api/agencies";

const router = Router();

router.get("/agencies", agencyList);

export default router;
