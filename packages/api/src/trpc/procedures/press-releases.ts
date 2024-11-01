import * as cms from "#cms/press-releases";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      return await cms.getById(input);
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });

export const list = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).optional().default(12),
      type: z.enum(["kenyataan_media", "ucapan", "other"]).optional(),
      sort: z.enum(["asc", "desc"]).optional(),
      agencies: z.array(z.string()).optional(),
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional(),
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
