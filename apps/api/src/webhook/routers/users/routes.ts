import { ValidatedRequest } from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body";
import { ResponseError } from "#webhook/routers/errors";
import type { Session } from "@repo/api/cms/schema/session";
import * as cms from "@repo/api/cms/users";
import { logger } from "@repo/api/logging/logger";
import express, { Response } from "express";

const router = express.Router();

router.post(
  "/login",
  validateWithSchema(cms.input.login),
  async function login(
    req: ValidatedRequest<typeof cms.input.login>,
    res: Response<ResponseError | Session>,
  ) {
    let result: Session | null = null;

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

            return;
          case "access_denied":
            res.status(403).send({
              code: "access_denied",
              message: "Forbidden: Access denied",
            });

            return;
          case "not_found":
            res.status(404).send({
              code: "not_found",
              message: "Not Found",
            });

            return;
          default:
            break;
        }
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal Server Error",
      });

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
    res: Response<ResponseError | Session>,
  ) {
    let result: Session | null = null;

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

            return;
          case "access_denied":
            res.status(403).send({
              code: "access_denied",
              message: "Forbidden: Access denied",
            });

            return;
          default:
            break;
        }
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal Server Error",
      });

      return;
    }

    res.status(200).send({
      exp: result.exp,
      token: result.token,
    });
  },
);

export { router };
