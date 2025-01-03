import { router as baseRouter } from "#trpc";
import { list, getById } from "#trpc/procedures/press-releases";

export const router = baseRouter({ list, getById });
