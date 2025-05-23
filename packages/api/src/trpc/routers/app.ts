import { router } from "#trpc";
import { router as pressReleaseRouter } from "./press-release";
import { router as agencyRouter } from "#trpc/routers/agency";
import { router as searchRouter } from "#trpc/routers/search";

export const appRouter = router({
  ["pressRelease"]: pressReleaseRouter,
  ["agency"]: agencyRouter,
  ["search"]: searchRouter,
});

export type AppRouter = typeof appRouter;
