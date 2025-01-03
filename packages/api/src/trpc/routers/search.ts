import { router as baseRouter } from "#trpc";
import { searchPressReleases } from "#trpc/procedures/search";

export const router = baseRouter({ pressReleases: searchPressReleases });
