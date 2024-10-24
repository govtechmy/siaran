import * as cms from "#cms/press-releases";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const list = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).optional().default(12),
      type: z.enum(["kenyataan_media", "ucapan", "other"]).optional(),
      agencies: z.array(z.string()).optional(),
      startDate: z.string().date().optional(), // YYYY-MM-DD (e.g. 2024-09-11)
      endDate: z.string().date().optional(), // YYYY-MM-DD (e.g. 2024-09-11)
      query: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    try {
      return await cms.list(input);
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });
