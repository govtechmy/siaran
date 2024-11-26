import { getToken } from "#cms/auth";
import * as cms from "#cms/search";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";

export const all = publicProcedure
  .input(cms.input.search)
  .query(async ({ input }) => {
    try {
      return await cms.search(input, { token: await getToken() });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });
