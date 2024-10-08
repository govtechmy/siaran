import { router } from "#trpc";
import { router as pressReleaseRouter } from "./press-release";
import { router as searchRouter } from "./search";

export const appRouter = router({
  ["pressRelease"]: pressReleaseRouter,
  ["search"]: searchRouter,
});

export type AppRouter = typeof appRouter;
