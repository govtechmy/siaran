import { getToken } from "#cms/auth";
import type {
  CMSLocale,
  Locale,
  PaginatedSearchResponse,
  PaginationParams,
} from "#cms/types";
import { cmsFetch, CMSFetchError } from "#http";

export async function search({
  page,
  limit,
  q,
}: PaginationParams & {
  q: string;
}) {
  try {
    return await cmsFetch<PaginatedSearchResponse>("/api/search", {
      method: "GET",
      query: { page, limit, q },
      headers: {
        ["Authorization"]: `Bearer ${await getToken()}`,
      },
    });
  } catch (e) {
    console.log("error:", e);
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to search [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`
      );
    }
    throw e;
  }
}

function mapLocale(locale: Locale): CMSLocale {
  switch (locale) {
    case "en-MY":
      return "en";
    case "ms-MY":
      return "ms";
  }
}
