import { getToken } from "#cms/auth";
import type {
  PaginatedResponse,
  PaginationParams,
  PressRelease,
  Sort,
} from "#cms/types";
import { cmsFetch, CMSFetchError } from "#http";
import { type SinglePossibleClause, whereClause } from "#cms/utils";

export async function list({
  page,
  limit,
  agencies,
  type,
  sort,
  startDate,
  endDate,
  query,
}: PaginationParams & {
  agencies?: string[];
  type?: string;
  sort?: Sort["pressReleases"];
  startDate?: string;
  endDate?: string;
  query?: string;
}) {
  const and: SinglePossibleClause[] = [];

  if (agencies && agencies?.length > 0) {
    and.push({
      ["relatedAgency"]: {
        in: agencies?.map((agency) => agency.toUpperCase()) ?? [],
      },
    });
  }

  if (type) {
    and.push({
      ["type"]: {
        equals: type,
      },
    });
  }

  if (startDate) {
    and.push({
      ["date_published"]: {
        greater_than_equal: startDate,
      },
    });
  }

  if (endDate) {
    and.push({
      ["date_published"]: {
        less_than_equal: endDate,
      },
    });
  }

  if (query) {
    and.push({
      or: [
        {
          ["title"]: {
            contains: query,
          },
        },
        {
          ["content.plaintext"]: {
            contains: query,
          },
        },
        {
          ["content.markdown"]: {
            contains: query,
          },
        },
      ],
    });
  }

  try {
    return await cmsFetch<PaginatedResponse<PressRelease>>(
      "/api/press-releases",
      {
        method: "GET",
        headers: {
          ["Authorization"]: `Bearer ${await getToken()}`,
        },
        query: {
          page,
          limit,
          sort: sort && sort === "asc" ? "date_published" : "-date_published",
          ...whereClause({ and }),
        },
      },
    );
  } catch (e) {
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to fetch press releases [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );
    }
    throw e;
  }
}
