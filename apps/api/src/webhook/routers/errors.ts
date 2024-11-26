import { z } from "@repo/api/extensions/zod";

type ResponseError = z.infer<ReturnType<typeof getErrorSchema>>;

function getErrorSchema<T extends string>({
  code,
  message,
}: {
  code: z.ZodEnum<[T, ...T[]]>;
  message: z.ZodString;
}) {
  return z.object({
    code,
    message,
  });
}

const types = [
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set",
] as const;

const errorCodes = [
  "invalid_type",
  "unrecognized_keys",
  "invalid_union",
  "invalid_enum_value",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "not_multiple_of",
  "custom",
] as const;

function getValidationErrorSchema() {
  return z.object({
    errors: z.array(
      z.object({
        code: z.enum(errorCodes).openapi({
          description: "Error code",
          examples: [...errorCodes],
        }),
        expected: z
          .enum(types)
          .optional()
          .openapi({
            description: "Expected type of the incorrect field",
            examples: [...types],
          }),
        received: z
          .enum(types)
          .optional()
          .openapi({
            description: "Received type of the incorrect field",
            examples: [...types],
          }),
        path: z.array(z.union([z.string(), z.number()])).openapi({
          description: "Path to the incorrect field",
        }),
        message: z.string().openapi({
          description: "Error message",
        }),
      }),
    ),
  });
}

export { getErrorSchema, getValidationErrorSchema, type ResponseError };
