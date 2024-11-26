import {
  type Session,
  type SessionTokenOnly,
  session as sessionSchema,
} from "#cms/schema/session";
import type { PaginatedResponse, User } from "#cms/types";
import { whereClause } from "#cms/utils/query";
import { z } from "#extensions/zod";
import { cmsFetch, CMSFetchError } from "#http";
import { logger } from "#logging/logger";

async function getByEmail(
  { email }: z.infer<typeof input.getByEmail>,
  { token }: SessionTokenOnly,
) {
  try {
    const result = await cmsFetch<PaginatedResponse<User>>(`/api/users`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
      query: {
        ...whereClause({
          and: [
            {
              ["email"]: {
                equals: email,
              },
            },
          ],
        }),
      },
    });

    if (result.docs.length === 0) {
      throw new Error("not_found");
    }

    return result.docs[0];
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to fetch press release [${e.response?.url}]: ${e.name ?? ""} ${e.statusCode ?? ""}`,
      );

      switch (e.statusCode) {
        case 400:
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

async function login({
  email,
  password,
}: z.infer<typeof input.login>): Promise<Session> {
  try {
    const { exp, token } = await cmsFetch<{ exp: number; token: string }>(
      "/api/users/login",
      {
        method: "POST",
        body: { email, password },
      },
    );

    return mapSession({ exp, token });
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(`Failed to login: ${e.message ?? ""} ${e.statusCode ?? ""}`);

      switch (e.statusCode) {
        case 400:
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

async function refreshToken({
  token,
}: z.infer<typeof input.refreshToken>): Promise<Session> {
  try {
    const { exp, refreshedToken } = await cmsFetch<{
      exp: number;
      refreshedToken: string;
    }>("/api/users/refresh-token", {
      method: "POST",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    return mapSession({ exp, token: refreshedToken });
  } catch (e) {
    if (e instanceof CMSFetchError) {
      logger.error(
        `Failed to refresh token: ${e.message ?? ""} ${e.statusCode ?? ""}`,
      );

      switch (e.statusCode) {
        case 401:
          throw new Error("invalid_token");
        case 403:
          throw new Error("access_denied");
        default:
          break;
      }
    }
    throw e;
  }
}

function mapSession(session: Session) {
  return {
    token: session.token,
    exp: session.exp * 1000,
  };
}

const input = {
  getByEmail: z.object({
    email: z.string().email(),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  refreshToken: z.object({
    token: z.string().openapi({
      description: "The non-expired access token",
      example: "<non-expired token>",
    }),
  }),
};

const output = {
  login: sessionSchema,
  refreshToken: sessionSchema,
};

export { getByEmail, input, login, output, refreshToken };
