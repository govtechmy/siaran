import { ValidatedRequest } from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body";
import { Definitions } from "#webhook/openapi";
import * as cms from "@repo/api/cms/users";
import { logger } from "@repo/api/logging/logger";
import express, { Response } from "express";
import { z } from "@repo/api/extensions/zod";
import { getErrorSchema } from "./errors";

const router = express.Router();

router.post(
  "/login",
  validateWithSchema(cms.input.login),
  async function login(
    req: ValidatedRequest<typeof cms.input.login>,
    res: Response,
  ) {
    let result: Awaited<ReturnType<typeof cms.login>>;

    try {
      result = await cms.login(req.body);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);

        switch (e.message) {
          case "invalid_credential":
            res.status(401).send({
              code: "invalid_credential",
              message: "Unauthorized: Invalid credential",
            });
            break;
          case "access_denied":
            res.status(403).send({
              code: "access_denied",
              message: "Forbidden: Access denied",
            });
            break;
          default:
            res.status(500).send({
              code: "internal_server_error",
              message: "Internal Server Error",
            });
            break;
        }
      }

      return;
    }

    res.status(200).send({
      exp: result.exp,
      token: result.token,
    });
  },
);

router.post(
  "/refresh-token",
  validateWithSchema(cms.input.refreshToken),
  async function refreshToken(
    req: ValidatedRequest<typeof cms.input.refreshToken>,
    res: Response,
  ) {
    let result: Awaited<ReturnType<typeof cms.refreshToken>>;

    try {
      result = await cms.refreshToken(req.body);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);

        switch (e.message) {
          case "invalid_token":
            res.status(401).send({
              code: "invalid_token",
              message: "Unauthorized: Invalid token or the token has expired",
            });
            break;
          case "access_denied":
            res.status(403).send({
              code: "access_denied",
              message: "Forbidden: Access denied",
            });
            break;
          default:
            res.status(500).send({
              code: "internal_server_error",
              message: "Internal Server Error",
            });
            break;
        }
      }

      return;
    }

    res.status(200).send({
      exp: result.exp,
      token: result.token,
    });
  },
);

export { router };
