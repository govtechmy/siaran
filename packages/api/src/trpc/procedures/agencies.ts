import * as cms from "#cms/agencies";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";

export const list = publicProcedure.query(async () => {
  try {
    return await cms.listAll();
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});
