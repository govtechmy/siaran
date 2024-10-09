import { Request, Response } from "express";
import payload from "payload";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LOCALE = "ms";

export async function searchAll(req: Request, res: Response) {
  try {
    const {
      query,
      locale,
      limit = 10,
      page = 1,
    } = parseQuerystring(req.query as unknown as string);

    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "q" is required.' });
    }

    const pressReleases = await payload.find({
      collection: "press-releases",
      where: {
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
        ],
        and: [
          {
            ["language"]: {
              equals: locale,
            },
          },
        ],
      },
      limit: limit,
      page: page,
    });

    const agencies = await payload.find({
      collection: "agencies",
      where: {
        or: [
          {
            ["name"]: {
              contains: query,
            },
          },
          {
            ["acronym"]: {
              contains: query,
            },
          },
        ],
      },
      limit: limit,
      page: page,
    });

    return res.status(200).json({
      pressReleases: pressReleases.docs,
      agencies: agencies.docs,
    });
  } catch (error) {
    console.error("Error searching content:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while searching." });
  }
}

function parseQuerystring(query: string) {
  const params = new URLSearchParams(query);

  return {
    query: params.get("q")?.trim() || "",
    locale: params.get("locale") || DEFAULT_LOCALE,
    limit: parseInt(params.get("limit")) || DEFAULT_PAGE_SIZE,
    page: parseInt(params.get("page")) || DEFAULT_PAGE,
  };
}
