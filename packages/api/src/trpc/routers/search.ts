import { router as baseRouter } from "#trpc";
import { all } from "#trpc/procedures/search";

export const router = baseRouter({ all });
