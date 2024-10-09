import { initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * @see: https://trpc.io/docs/server/context
 */
export async function createContext(options: CreateExpressContextOptions) {
  return {};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
