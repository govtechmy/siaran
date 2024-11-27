import { ValidatedRequest } from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body";
import {
  accessDenied,
  internalServerError,
  invalidCredential,
  invalidToken,
  notFound,
} from "#webhook/responses/errors";
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
            res.status(401).send(invalidCredential);
            return;
          case "access_denied":
            res.status(403).send(accessDenied);
            return;
          case "not_found":
            res.status(404).send(notFound);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
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
            res.status(401).send(invalidToken);
            return;
          case "access_denied":
            res.status(403).send(accessDenied);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    res.status(200).send({
      exp: result.exp,
      token: result.token,
    });
  },
);

export { router };
