import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

export const appRouter = router({
  ping: publicProcedure.query(({ input }) => {
    return "pong";
  }),
});

export type AppRouter = typeof appRouter;
