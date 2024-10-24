import { getToken } from "#cms/auth";
import type { Agency, PaginatedResponse } from "#cms/types";
import { cmsFetch, CMSFetchError } from "#http";

export async function listAll() {
  try {
    const data = await cmsFetch<PaginatedResponse<Agency>>("/api/agencies", {
      method: "GET",
      query: { limit: 0 },
      headers: {
        ["Authorization"]: `Bearer ${await getToken()}`,
      },
    });

    return data.docs || [];
  } catch (e) {
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to fetch agencies [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`
      );
    }
    throw e;
  }
}
