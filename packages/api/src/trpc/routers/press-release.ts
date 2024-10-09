import { router as baseRouter } from "#trpc";
import { list } from "#trpc/procedures/press-releases";

export const router = baseRouter({ list });
