import { NextFunction, Request, Response } from "express";
import { logger } from "#logging/logger";

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  res.once("finish", () => {
    logger.info(
      `[${req.method}] ${req.url} ${res.statusCode} ${Date.now() - startTime}ms [decoded URL: ${decodeURIComponent(req.url)}]`
    );
  });

  next();
}
