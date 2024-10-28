import * as cms from "#cms/search";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const searchAll = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(10),
      q: z.string().default(""),
    }),
  )
  .query(async ({ input }) => {
    try {
      return await cms.search(input);
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });
