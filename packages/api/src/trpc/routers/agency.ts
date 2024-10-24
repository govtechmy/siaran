import { router as baseRouter } from "#trpc";
import { list } from "#trpc/procedures/agencies";

export const router = baseRouter({ list });
