import { router as baseRouter } from "#trpc";
import { searchAll } from "#trpc/procedures/search";

export const router = baseRouter({ searchAll });
