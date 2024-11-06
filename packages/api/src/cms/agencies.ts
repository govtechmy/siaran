import type { SessionTokenOnly } from "#cms/schema/session";
import type { Agency, PaginatedResponse } from "#cms/types";
import { cmsFetch, CMSFetchError } from "#http";
import { logger } from "#logging/logger";

export async function listAll({ token }: SessionTokenOnly) {
  try {
    const data = await cmsFetch<PaginatedResponse<Agency>>("/api/agencies", {
      method: "GET",
      query: { limit: 0 },
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    return data.docs || [];
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to fetch agencies [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );
    }
    throw e;
  }
}
