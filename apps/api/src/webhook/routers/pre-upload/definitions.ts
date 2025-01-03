import type { Definition } from "#webhook/openapi";
import {
  getErrorSchema,
  getValidationErrorSchema,
} from "#webhook/routers/errors";
import { z } from "@repo/api/extensions/zod";
import { input, output } from "./routes";

const TAG = "Pre-upload";

const definitions = [
  {
    tags: [TAG],
    auth: true,
    request: {
      description: "Generate a presigned URL for pre-uploading a file",
      method: "post",
      path: "/webhook/pre-upload/{sessionId}",
      params: {
        sessionId: z.string(),
      },
      body: input.getPreUploadUrl,
    },
    responses: [
      {
        status: 200,
        description: "OK",
        body: output.getPreUploadUrl,
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
            "invalid_user",
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
        status: 404,
        description: "Not found",
        body: getErrorSchema({
          code: z.enum(["not_found"]),
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
    auth: true,
    request: {
      description: "Delete a pre-uploaded file",
      method: "delete",
      path: "/webhook/pre-upload/{sessionId}/{filename}",
      params: {
        sessionId: z.string(),
        filename: z.string(),
      },
    },
    responses: [
      {
        status: 204,
        description: "OK",
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
            "invalid_user",
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
] satisfies Definition[];

export { definitions };
