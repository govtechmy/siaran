import { logger } from "@repo/api/logging/logger";
import { NextFunction, Request, Response } from "express";

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = Date.now();

  res.once("finish", () => {
    logger.info(
      `[${req.method}] ${req.url} ${res.statusCode} ${Date.now() - startTime}ms [decoded URL: ${decodeURIComponent(req.url)}]`,
    );
  });

  next();
}
