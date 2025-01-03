import { getToken } from "#cms/auth";
import * as cms from "#cms/press-releases";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";

export const getById = publicProcedure
  .input(cms.input.getById)
  .query(async ({ input }) => {
    try {
      return await cms.getById(input, { token: await getToken() });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });

export const list = publicProcedure
  .input(cms.input.list)
  .query(async ({ input }) => {
    try {
      return await cms.list(input, { token: await getToken() });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });
