import { getToken } from "#cms/auth";
import * as cms from "#cms/search";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";

export const searchPressReleases = publicProcedure
  .input(cms.input.searchPressReleases)
  .query(async ({ input }) => {
    try {
      return await cms.searchPressReleases(input, { token: await getToken() });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });
