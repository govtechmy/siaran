import { definitions as preUploadDefinitions } from "#webhook/routers/pre-upload/definitions";
import { definitions as pressReleaseDefinitions } from "#webhook/routers/press-releases/definitions";
import { definitions as userDefinitions } from "#webhook/routers/users/definitions";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "@repo/api/extensions/zod";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registerDefinition(registry, userDefinitions);
registerDefinition(registry, preUploadDefinitions);
registerDefinition(registry, pressReleaseDefinitions);

const generator = new OpenApiGeneratorV3(registry.definitions);

type Definition = {
  tags: string[];
  auth?: boolean;
  request: {
    path: string;
    method: "post" | "get" | "put" | "delete" | "patch";
    description: string;
    body?: z.Schema;
    headers?: z.AnyZodObject;
    query?: z.AnyZodObject;
    params?: Partial<{
      [key: string]: z.ZodType;
    }>;
  };
  responses: {
    status: HTTPStatusCode;
    description: string;
    body?: z.Schema;
  }[];
};

function defineResponse(
  status: HTTPStatusCode,
  definition: Definition["responses"][HTTPStatusCode],
) {
  return {
    [status]: definition,
  };
}

function registerDefinition(
  registry: OpenAPIRegistry,
  definitions: Definition[],
) {
  definitions.forEach(({ tags, auth, request, responses }) => {
    let params: { [key: string]: z.ZodType } = {};

    Object.entries(request.params ?? {}).forEach(([name, type]) => {
      // Register URL parameter
      const schema = registry.registerParameter(
        name,
        type.openapi({
          param: {
            name,
            in: "path",
          },
        }),
      );

      // To add to the request definition
      params[name] = schema;
    });

    registry.registerPath({
      method: request.method,
      path: request.path,
      description: request.description,
      security:
        auth === true
          ? [
              {
                bearerAuth: [],
              },
            ]
          : undefined,
      request: {
        headers: request.headers,
        query: request.query,
        params: Object.keys(params).length > 0 ? z.object(params) : undefined,
        body: request.body
          ? {
              content: {
                "application/json": {
                  schema: request.body,
                },
              },
            }
          : undefined,
      },
      responses: responses.reduce(
        (acc, { status, description, body }) => ({
          ...acc,
          [status]: {
            description,
            content: body
              ? {
                  "application/json": {
                    schema: body,
                  },
                }
              : undefined,
          },
        }),
        {},
      ),
      tags,
    });
  });
}

type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

export { defineResponse, generator, type Definition, type HTTPStatusCode };
