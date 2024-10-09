import { getToken } from "#cms/auth";
import type {
  PaginatedResponse,
  PaginationParams,
  PressRelease,
} from "#cms/types";
import { cmsFetch, CMSFetchError } from "#http";

export async function list({
  page,
  limit,
  date,
}: PaginationParams & {
  date?: string;
}) {
  try {
    return await cmsFetch<PaginatedResponse<PressRelease>>(
      "/api/press-releases",
      {
        method: "GET",
        query: { page, limit, date },
        headers: {
          ["Authorization"]: `Bearer ${await getToken()}`,
        },
      }
    );
  } catch (e) {
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to fetch press releases [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`
      );
    }
    throw e;
  }
}
