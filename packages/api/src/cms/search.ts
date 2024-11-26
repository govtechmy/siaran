import type { SessionTokenOnly } from "#cms/schema/session";
import type { PaginatedSearchResponse } from "#cms/types";
import { z } from "#extensions/zod";
import { cmsFetch, CMSFetchError } from "#http";
import { logger } from "#logging/logger";

export async function search(
  { page, limit, q }: z.infer<typeof input.search>,
  { token }: SessionTokenOnly,
) {
  try {
    return await cmsFetch<PaginatedSearchResponse>("/api/search", {
      method: "GET",
      query: { page, limit, q },
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to search [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );
    }
    throw e;
  }
}

export const input = {
  search: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
    q: z.string().default(""),
  }),
};
