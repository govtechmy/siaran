import type { Definition } from "#webhook/openapi";
import {
  getErrorSchema,
  getValidationErrorSchema,
} from "#webhook/routers/errors";
import * as cms from "@repo/api/cms/press-releases";
import { z } from "@repo/api/extensions/zod";

const TAG = "Press Releases";

const definitions = [
  {
    tags: [TAG],
    auth: true,
    request: {
      description: "Create a new press release",
      method: "post",
      path: "/webhook/press-releases",
      body: cms.input.create.omit({
        relatedAgency: true,
      }),
    },
    responses: [
      {
        status: 201,
        description: "OK",
        body: cms.output.create,
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
            "invalid_user_agency",
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
    auth: true,
    request: {
      description: "Get a press release",
      method: "get",
      path: "/webhook/press-releases/{id}",
      params: {
        id: cms.schema.id,
      },
    },
    responses: [
      {
        status: 200,
        description: "OK",
        body: cms.output.getById,
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
            "invalid_user_agency",
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
        description: "Forbidden",
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
      description: "Delete a press release",
      method: "delete",
      path: "/webhook/press-releases/{id}",
      params: {
        id: cms.schema.id,
      },
    },
    responses: [
      {
        status: 204,
        description: "No Content",
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
          code: z.enum(["access_denied", "agency_mismatch"]),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: "Not Found",
        body: getErrorSchema({
          code: z.enum(["invalid_press_release", "not_found"]),
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
      description: "Generate a presigned URL for uploading an attachment",
      method: "post",
      path: "/webhook/press-releases/{id}/attachment/upload",
      params: {
        id: cms.schema.id,
      },
      body: cms.input.upload,
    },
    responses: [
      {
        status: 200,
        description: "OK",
        body: cms.output.upload,
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
          code: z.enum(["access_denied", "agency_mismatch"]),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: "Not Found",
        body: getErrorSchema({
          code: z.enum(["invalid_press_release"]),
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
      description: "Delete an attachment",
      method: "delete",
      path: "/webhook/press-releases/{id}/attachment/{filename}",
      params: {
        id: cms.schema.id,
      },
    },
    responses: [
      {
        status: 204,
        description: "No Content",
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
          code: z.enum(["access_denied", "agency_mismatch"]),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: "Not Found",
        body: getErrorSchema({
          code: z.enum(["invalid_press_release", "not_found"]),
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
      description:
        "Call this endpoint after uploading an attachment to record the uploaded file",
      method: "post",
      path: "/webhook/press-releases/{id}/attachment/upload/complete",
      params: {
        id: cms.schema.id,
      },
      body: cms.input.upload,
    },
    responses: [
      {
        status: 204,
        description: "No Content",
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
          code: z.enum(["access_denied", "agency_mismatch"]),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: "Not Found",
        body: getErrorSchema({
          code: z.enum(["invalid_press_release"]),
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
