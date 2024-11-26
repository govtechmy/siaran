import { pressRelease as pressReleaseSchema } from "#cms/schema/press-release";
import type { SessionTokenOnly as SessionWithTokenOnly } from "#cms/schema/session";
import type { PaginatedResponse, PressRelease } from "#cms/types";
import { type SinglePossibleClause, whereClause } from "#cms/utils/query";
import { z } from "#extensions/zod";
import { cmsFetch, CMSFetchError } from "#http";
import { logger } from "#logging/logger";
import { mapLocale } from "./utils/locale";

type MappedParams = Pick<
  PressRelease,
  "language" | "title" | "type" | "date_published" | "content" | "attachments"
> & {
  relatedAgency: string;
};

function mapParams<
  T extends
    | z.infer<typeof input.create>
    | z.infer<typeof input.update>["params"],
>(params: T) {
  let body = {} as T extends z.infer<typeof input.create>
    ? MappedParams
    : Partial<MappedParams>;

  if (params.language) {
    body.language = mapLocale(params.language);
  }

  if (params.title != null) {
    body.title = params.title;
  }

  if (params.type) {
    body.type = params.type;
  }

  if (params.datePublished) {
    body.date_published = params.datePublished;
  }

  if (params.content) {
    body.content = {} as PressRelease["content"];

    if (params.content.plain != null) {
      body.content.plain = params.content.plain;
    }

    if (params.content.markdown != null) {
      body.content.markdown = params.content.markdown;
    }
  }

  if (params.attachments) {
    body.attachments = params.attachments.map((attachment) => {
      return {
        url: attachment.url,
        alt: attachment.alt ?? "",
        file_name: attachment.file.name,
        file_type: attachment.file.type,
        file_size: attachment.file.size,
      };
    });
  }

  if (params.relatedAgency) {
    body.relatedAgency = params.relatedAgency;
  }

  return body;
}

async function create(
  params: z.infer<typeof input.create>,
  { token }: SessionWithTokenOnly,
) {
  try {
    return await cmsFetch<z.infer<typeof output.create>>(
      "/api/press-releases",
      {
        method: "POST",
        headers: {
          ["Authorization"]: `Bearer ${token}`,
        },
        body: JSON.stringify(mapParams<typeof params>(params)),
      },
    );
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(`Failed to login: ${e.message ?? ""} ${e.statusCode ?? ""}`);

      switch (e.statusCode) {
        case 400:
          throw new Error("invalid_input");
        case 403:
          throw new Error("access_denied");
        default:
          break;
      }
    }

    throw e;
  }
}

async function update(
  { id, params }: z.infer<typeof input.update>,
  { token }: SessionWithTokenOnly,
) {
  try {
    return await cmsFetch<void>(`/api/press-releases/${id}`, {
      method: "PATCH",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
      body: JSON.stringify(mapParams<typeof params>(params)),
    });
  } catch (e) {
    throw e;
  }
}

async function deleteById(
  { id }: z.infer<typeof input.deleteById>,
  { token }: SessionWithTokenOnly,
) {
  try {
    return await cmsFetch<PressRelease>(`/api/press-releases/${id}`, {
      method: "DELETE",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to fetch press release [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );

      if (e.statusCode === 404) {
        return null;
      }
    }

    throw e;
  }
}

async function getById(
  { id }: z.infer<typeof input.getById>,
  { token }: SessionWithTokenOnly,
) {
  try {
    return await cmsFetch<PressRelease>(`/api/press-releases/${id}`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to fetch press release [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );

      switch (e.statusCode) {
        case 401:
          throw new Error("invalid_credential");
        case 403:
          throw new Error("access_denied");
        case 404:
          throw new Error("not_found");
        default:
          break;
      }
    }

    throw e;
  }
}

async function list(
  {
    page,
    limit,
    agencies,
    type,
    sort,
    startDate,
    endDate,
    query,
  }: z.infer<typeof input.list>,
  { token }: SessionWithTokenOnly,
) {
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
          ["content.plain"]: {
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
          ["Authorization"]: `Bearer ${token}`,
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
      logger.error(
        `Failed to fetch press releases [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );
    }
    throw e;
  }
}

const schema = {
  id: z.string().openapi({
    description: "Press release ID",
  }),
  attachment: {
    file: {
      name: z.string().openapi({
        example: "Merdeka_1957_tunku_abdul_rahman.jpg",
      }),
      type: z.enum([
        "image/png",
        "image/jpeg",
        "text/plain",
        "text/markdown",
        "application/pdf",
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      ]),
    },
  },
  relatedAgency: z.enum([
    "ECC",
    "JWP",
    "KBS",
    "KDN",
    "KE",
    "KKD",
    "KKDW",
    "KKR",
    "KLN",
    "KPDN",
    "KPKT",
    "KPN",
    "KPWKM",
    "KWP",
    "MACC",
    "MAFS",
    "MCMC",
    "MECD",
    "MINDEF",
    "MITI",
    "MOE",
    "MOF",
    "MOH",
    "MOHE",
    "MOHR",
    "MOSTI",
    "MOT",
    "MOTAC",
    "MPIC",
    "MYCC",
    "NRECC",
    "NRES",
    "PETRA",
    "PMO",
    "SPP",
    "SSM",
  ]),
};

const propTypes = {
  body: {
    language: z.enum(["en-MY", "ms-MY"]).openapi({
      description: "Press release language",
      example: "en-MY",
    }),
    title: z.string().openapi({
      example: "Malayan Declaration of Independence",
    }),
    type: z.enum(["kenyataan_media", "ucapan", "other"]).openapi({
      description: "Press release type",
    }),
    datePublished: z.string().datetime().openapi({
      description: "Publication date",
      example: "1957-08-31T02:00:00.000Z",
    }),
    content: z.object({
      plain: z.string().openapi({
        description: "Content (plain text)",
        example:
          "In the name of Allah, the Compassionate, the Merciful. Praise be to Allah, the Lord of the Universe and may the blessings and peace of Allah be upon His Messenger and those related to him.\n\nWhereas the time has now arrived when the people of the Federation of Malaya will assume the status of a free independent and sovereign nation among nations of the World.",
      }),
      markdown: z.string().optional().openapi({
        description: "Content (Markdown)",
        example: `_[In the name of Allah, the Compassionate, the Merciful](https://en.wikipedia.org/wiki/Basmala). Praise be to Allah, the Lord of the Universe and may the blessings and peace of Allah be upon His Messenger and those related to him.\n\nWhereas the time has now arrived when the people of the Federation of Malaya will assume the status of a free independent and sovereign nation among nations of the World._`,
      }),
    }),
    priority: z.enum(["high", "medium", "low"]).openapi({
      example: "high",
    }),
    relatedAgency: schema.relatedAgency.openapi({
      example: "PMO",
    }),
    attachments: z
      .array(
        z.object({
          url: z.string().url().openapi({
            example:
              "https://upload.wikimedia.org/wikipedia/commons/6/69/Merdeka_1957_tunku_abdul_rahman.jpg",
          }),
          alt: z.string().nullable().optional().openapi({
            example: `Tunku Abdul Rahman chanting "freedom!" when signing the Malayan Declaration of Independence in 1957.`,
          }),
          file: z.object({
            name: schema.attachment.file.name,
            type: schema.attachment.file.type.openapi({
              description:
                "File type (images, PDFs, text and office documents)",
              example: "image/jpeg",
            }),
            size: z.number().openapi({
              description: "File size in bytes",
              example: 51102,
            }),
          }),
        }),
      )
      .optional()
      .openapi({
        description: "Linked attachments",
      }),
  },
};

const input = {
  create: z.object(propTypes.body),
  update: z.object({
    id: schema.id,
    params: z.object(propTypes.body).partial(),
  }),
  upload: z.object({
    filename: z.string().openapi({
      description: "Attachment file name",
      example: "attachment.pdf",
    }),
    contentType: schema.attachment.file.type.openapi({
      description: "Attachment file type",
      example: "application/pdf",
    }),
  }),
  deleteById: z.object({ id: schema.id }),
  getById: z.object({ id: schema.id }),
  list: z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).optional().default(12),
    type: z.enum(["kenyataan_media", "ucapan", "other"]).optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    agencies: z.array(z.string()).optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    query: z.string().optional(),
  }),
};

const output = {
  create: z.object({
    doc: z.object({
      id: z.string(),
    }),
  }),
  upload: z.string().url(),
  getById: pressReleaseSchema,
};

namespace Input {
  export type AttachmentFileType = z.infer<typeof schema.attachment.file.type>;
  export type Agency = z.infer<typeof schema.relatedAgency>;
}

export {
  create,
  deleteById,
  getById,
  input,
  list,
  output,
  schema,
  update,
  type Input,
};
