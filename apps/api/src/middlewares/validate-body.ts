import { logger } from "@repo/api/logging/logger";
import { NextFunction, Request, Response } from "express";
import z from "zod";

export default function validateWithSchema<Schema extends z.Schema>(
  schema: Schema,
) {
  return function validateBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Promise<void> {
    const result = schema.safeParse(req.body);

    if (result.error) {
      logger.error(`[Validation] Error: ${result.error.errors.join(", ")}`);
      res.status(400).json({ errors: result.error.errors });
      return;
    }

    if (result.success) {
      req.body = result.data;
    }

    next();
  };
}
