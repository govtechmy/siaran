import type { Definition } from "#webhook/openapi";
import {
  getErrorSchema,
  getValidationErrorSchema,
} from "#webhook/routers/errors";
import * as cms from "@repo/api/cms/users";
import { z } from "@repo/api/extensions/zod";

const TAG = "Auth";

const definitions = [
  {
    tags: [TAG],
    request: {
      description: "Log in",
      method: "post",
      path: "/webhook/users/login",
      body: cms.input.login,
    },
    responses: [
      {
        status: 200,
        description: "OK",
        body: cms.output.login,
      },
      {
        status: 400,
        description: "Bad Request",
        body: getValidationErrorSchema(),
      },
      {
        status: 401,
        description: "Unauthorized",
        body: getErrorSchema({
          code: z.enum([
            "missing_token",
            "invalid_token",
            "token_expired",
            "invalid_credential",
          ]),
          message: z.string(),
        }),
      },
      {
        status: 403,
        description: "Forbidden",
        body: getErrorSchema({
          code: z.enum(["access_denied"]),
          message: z.string(),
        }),
      },
      {
        status: 500,
        description: "Internal Server Error",
        body: getErrorSchema({
          code: z.enum(["internal_server_error"]),
          message: z.string(),
        }),
      },
    ],
  },
  {
    tags: [TAG],
    request: {
      description: "Refresh token",
      method: "post",
      path: "/webhook/users/refresh-token",
      body: cms.input.refreshToken,
    },
    responses: [
      {
        status: 200,
        description: "OK",
        body: cms.output.refreshToken,
      },
      {
        status: 400,
        description: "Bad Request",
        body: getValidationErrorSchema(),
      },
      {
        status: 401,
        description: "Unauthorized",
        body: getErrorSchema({
          code: z.enum(["missing_token", "invalid_token", "token_expired"]),
          message: z.string(),
        }),
      },
      {
        status: 403,
        description: "Forbidden",
        body: getErrorSchema({
          code: z.enum(["access_denied"]),
          message: z.string(),
        }),
      },
      {
        status: 500,
        description: "Internal Server Error",
        body: getErrorSchema({
          code: z.enum(["internal_server_error"]),
          message: z.string(),
        }),
      },
    ],
  },
] satisfies Definition[];

export { definitions };
