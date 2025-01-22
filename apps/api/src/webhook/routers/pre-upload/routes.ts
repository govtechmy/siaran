import type {
  AuthenticatedResponse,
  ValidatedRequest,
} from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body.js";
import {
  accessDenied,
  internalServerError,
  invalidCredential,
  invalidUser,
  notFound,
} from "#webhook/responses/errors";
import { ResponseError } from "#webhook/routers/errors";
import {
  deleteObject,
  getObjectUrl,
  getUploadUrl,
  listObjects,
} from "@repo/api/aws/s3";
import {
  acceptedFileTypes,
  filename,
  previewUrl,
  url,
} from "@repo/api/cms/schema/common";
import type { User } from "@repo/api/cms/types";
import * as cmsUsers from "@repo/api/cms/users";
import { getPreUploadPath } from "@repo/api/cms/utils/upload";
import { logger } from "@repo/api/logging/logger";
import express, { Request } from "express";
import { z } from "zod";

const router = express.Router();

export const input = {
  getPreUploadUrl: z.object({
    filename: filename,
    contentType: acceptedFileTypes,
  }),
};

export const output = {
  getPreUploadUrl: z.object({ url, previewUrl }),
};

router.post(
  "/:sessionId",
  validateWithSchema(input.getPreUploadUrl),
  async function getPreUploadUrl(
    req: ValidatedRequest<typeof input.getPreUploadUrl, { sessionId: string }>,
    res: AuthenticatedResponse<
      ResponseError | z.infer<typeof output.getPreUploadUrl>
    >,
  ) {
    let user: User | null = null;

    try {
      user = await cmsUsers.getByEmail(
        { email: res.locals.session.email },
        { token: res.locals.session.token },
      );
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
            res.status(401).send(invalidUser);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    const key = getPreUploadPath({
      userId: user.id,
      sessionId: req.params.sessionId,
      filename: req.body.filename,
    });

    res.status(200).send({
      url: await getUploadUrl({
        path: key,
        contentType: req.body.contentType,
      }),
      previewUrl: await getObjectUrl(key),
    });
  },
);

router.delete(
  "/:sessionId/:filename",
  async function deletePreUploadedFile(
    req: Request<{ sessionId: string; filename: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    let user: User | null = null;

    try {
      user = await cmsUsers.getByEmail(
        { email: res.locals.session.email },
        { token: res.locals.session.token },
      );
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
            res.status(401).send(invalidUser);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    const { sessionId, filename } = req.params;

    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        prefix: getPreUploadPath({
          userId: user.id,
          sessionId,
          filename,
        }),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    const object = objects.find((object) => object.key.endsWith(filename));

    if (!object) {
      res.status(404).send(notFound);
      return;
    }

    try {
      await deleteObject({ key: object.key });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    res.status(204).send();
  },
);

export { router };
