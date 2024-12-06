import type {
  AuthenticatedResponse,
  ValidatedRequest,
} from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body";
import {
  accessDenied,
  internalServerError,
  invalidCredential,
  invalidPressRelease,
  invalidUser,
  notFound,
} from "#webhook/responses/errors";
import { ResponseError } from "#webhook/routers/errors";
import {
  copyObjects,
  deleteObject,
  deleteObjects,
  getObject,
  getUploadUrl,
  listObjects,
} from "@repo/api/aws/s3";
import * as cmsPressReleases from "@repo/api/cms/press-releases";
import type {
  Agency,
  Attachment,
  PressRelease,
  User,
} from "@repo/api/cms/types";
import * as cmsUsers from "@repo/api/cms/users";
import {
  getPressReleaseAttachmentFilePath,
  getPressReleaseAttachmentPath,
  getPreUploadPrefix,
} from "@repo/api/cms/utils/upload";
import { logger } from "@repo/api/logging/logger";
import express, { Request } from "express";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  validateWithSchema(
    cmsPressReleases.input.create.omit({
      relatedAgency: true,
    }),
  ),
  async function create(
    req: ValidatedRequest<typeof cmsPressReleases.input.create>,
    res: AuthenticatedResponse<
      ResponseError | z.infer<typeof cmsPressReleases.output.create>
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
          case "not_found":
            res.status(401).send(invalidUser);
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

    if (!user.agency || !user.agency.id) {
      res.status(401).send({
        code: "invalid_user_agency",
        message: "Unauthorized: This user does not belong an agency",
      });

      return;
    }

    let result: Awaited<ReturnType<typeof cmsPressReleases.create>>;

    try {
      result = await cmsPressReleases.create(
        {
          ...req.body,
          relatedAgency: user.agency.id as cmsPressReleases.Input.Agency,
        },
        {
          token: res.locals.session.token,
        },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);

        switch (e.message) {
          case "invalid_input":
            res.status(400).send({
              code: "invalid_input",
              message: "Bad Request: Invalid input",
            });
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

    res
      .status(201)
      .header("Location", `/webhook/press-releases/${result.doc.id}`)
      .send({
        doc: {
          id: result.doc.id,
        },
      });
  },
);

router.get(
  "/:id",
  async function getById(
    req: Request<{ id: string }>,
    res: AuthenticatedResponse<ResponseError | PressRelease>,
  ) {
    const { id } = req.params;

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
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
            res.status(404).send({
              code: "not_found",
              message: "Not Found",
            });
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    res.status(200).send(data);
  },
);

router.delete(
  "/:id",
  async function deleteById(
    req: Request<{ id: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    const { id } = req.params;

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
        { token: res.locals.session.token },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (!data) {
      res.status(404).send(notFound);
      return;
    }

    // Ensure user privilege is correct
    let user: User | null = null;

    try {
      user = await cmsUsers.getByEmail(
        { email: res.locals.session.email },
        { token: res.locals.session.token },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (!user) {
      res.status(401).send(invalidUser);
      return;
    }

    if (
      !matchAgency({
        userAgency: user.agency,
        targetAgency: data.relatedAgency,
      })
    ) {
      res.status(403).send({
        code: "agency_mismatch",
        message: "Forbidden: User/Agency mismatch",
      });

      return;
    }

    try {
      await cmsPressReleases.deleteById(
        { id: data.id },
        { token: res.locals.session.token },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    // Delete all attachments from storage
    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        prefix: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (objects && objects.length > 0) {
      try {
        await Promise.all(
          objects.map((object) => {
            if (!object.key) {
              return Promise.resolve();
            }

            return deleteObject({ key: object.key });
          }),
        );
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.stack);
        }

        res.status(500).send(internalServerError);
        return;
      }
    }

    res.status(204).end();
  },
);

/*
 * Commit pre-uploaded attachments to the database and delete the pre-uploaded files from storage.
 * Throw 404 if the session is not found.
 */
router.post(
  "/:id/pre-upload/:sessionId/commit/attachments",
  async function commitPreUploadPressReleaseAttachments(
    req: Request<{ sessionId: string; id: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    const { id } = req.params;

    // Ensure user privilege is correct
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

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (
      !matchAgency({
        userAgency: user.agency,
        targetAgency: data.relatedAgency,
      })
    ) {
      res.status(403).send({
        code: "agency_mismatch",
        message: "Forbidden: User/Agency mismatch",
      });

      return;
    }

    const srcPrefix = getPreUploadPrefix({
      userId: user.id,
      sessionId: req.params.sessionId,
    });

    // Copy pre-uploaded attachments to the press release attachments directory
    try {
      await copyObjects({
        srcPrefix,
        destPrefix: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);

        switch (e.message) {
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

    try {
      await sync({ id, token: res.locals.session.token });
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    // Remove the pre-uploaded objects
    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        prefix: srcPrefix,
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (objects.length > 0) {
      try {
        await deleteObjects({
          keys: objects.map((obj) => obj.key),
        });
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.stack);

          switch (e.message) {
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
    }

    res.status(204).end();
  },
);

// Generates a presigned URL for uploading an attachment
router.post(
  "/:id/attachment/upload",
  validateWithSchema(cmsPressReleases.input.upload),
  async function getUploadAttachmentUrl(
    req: ValidatedRequest<typeof cmsPressReleases.input.upload, { id: string }>,
    res: AuthenticatedResponse<
      ResponseError | z.infer<typeof cmsPressReleases.output.upload>
    >,
  ) {
    const { id } = req.params;

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    // Ensure user privilege is correct
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

    if (
      !matchAgency({
        userAgency: user.agency,
        targetAgency: data.relatedAgency,
      })
    ) {
      res.status(403).send({
        code: "agency_mismatch",
        message: "Forbidden: User/Agency mismatch",
      });

      return;
    }

    res.status(200).send({
      url: await getUploadUrl({
        path: getPressReleaseAttachmentFilePath(id, req.body.filename),
        contentType: req.body.contentType,
      }),
    });
  },
);

//
//
//
//
//

router.delete(
  "/:id/attachments",
  async function deleteAllAttachments(
    req: Request<{ id: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    const { id } = req.params;

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
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
            res.status(404).send(notFound);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    // Ensure user privilege is correct
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (
      !matchAgency({
        userAgency: user.agency,
        targetAgency: data.relatedAgency,
      })
    ) {
      res.status(403).send({
        code: "agency_mismatch",
        message: "Forbidden: User/Agency mismatch",
      });

      return;
    }

    if (!Array.isArray(data.attachments) || data.attachments.length === 0) {
      res.status(404).send(notFound);
      return;
    }

    try {
      await cmsPressReleases.update(
        {
          id,
          params: {
            attachments: [],
          },
        },
        { token: res.locals.session.token },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        prefix: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (objects.length > 0) {
      try {
        await Promise.all(
          objects.map((object) => deleteObject({ key: object.key })),
        );
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.stack);
        }

        res.status(500).send(internalServerError);
        return;
      }
    }

    res.status(204).end();
  },
);

router.delete(
  "/:id/attachment/:filename",
  async function deleteAttachment(
    req: Request<{ id: string; filename: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    const { id, filename } = req.params;

    let data: PressRelease | null = null;

    try {
      data = await cmsPressReleases.getById(
        { id },
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
            res.status(404).send(notFound);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    // Ensure user privilege is correct
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    if (
      !matchAgency({
        userAgency: user.agency,
        targetAgency: data.relatedAgency,
      })
    ) {
      res.status(403).send({
        code: "agency_mismatch",
        message: "Forbidden: User/Agency mismatch",
      });

      return;
    }

    if (
      !Array.isArray(data.attachments) ||
      !data.attachments.find((attachment) => attachment.file_name === filename)
    ) {
      res.status(404).send(notFound);
      return;
    }

    try {
      await cmsPressReleases.update(
        {
          id,
          params: {
            attachments: data.attachments
              .filter((attachment) => attachment.file_name !== filename)
              .map((attachment) => ({
                url: attachment.url,
                alt: attachment.alt,
                file: {
                  name: attachment.file_name,
                  size: attachment.file_size,
                  type: attachment.file_type as cmsPressReleases.Input.AttachmentFileType,
                },
              })),
          },
        },
        { token: res.locals.session.token },
      );
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        prefix: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send(internalServerError);
      return;
    }

    const object = objects?.find(
      (object) =>
        object.key === getPressReleaseAttachmentFilePath(id, filename),
    );

    if (object && object.key) {
      try {
        await deleteObject({ key: object.key });
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.stack);
        }

        res.status(500).send(internalServerError);
        return;
      }
    }

    res.status(204).end();
  },
);

// Call this endpoint after uploading an attachment to record the uploaded file
router.post(
  "/:id/attachment/upload/complete",
  async function uploadAttachmentComplete(
    req: Request<{ id: string }>,
    res: AuthenticatedResponse<ResponseError>,
  ) {
    try {
      await sync({ id: req.params.id, token: res.locals.session.token });
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
            res.status(404).send(invalidPressRelease);
            return;
          default:
            break;
        }
      }

      res.status(500).send(internalServerError);
      return;
    }

    res.status(204).end();
  },
);

function matchAgency(params: { userAgency: Agency; targetAgency: Agency }) {
  const { userAgency, targetAgency } = params;

  if (!userAgency || !targetAgency) {
    logger.error(new Error(`Missing agency: ${JSON.stringify(params)}`).stack);
  }

  return userAgency.id === targetAgency.id;
}

/**
 * Sync the files in storage and the files recorded in the database
 */
async function sync({ id, token }: { id: string; token: string }) {
  let data: PressRelease | null = null;

  try {
    data = await cmsPressReleases.getById({ id }, { token });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);

      switch (e.message) {
        case "invalid_credential":
          throw new Error("invalid_credential");
        case "access_denied":
          throw new Error("access_denied");
        case "not_found":
          throw new Error("not_found");
        default:
          break;
      }
    }

    throw new Error("sync_failed");
  }

  let objects: Awaited<ReturnType<typeof listObjects>>;
  let attachments = (data.attachments ?? []) as Attachment[];

  try {
    objects = await listObjects({
      prefix: getPressReleaseAttachmentPath(id),
    });

    // Get the metadata of each object
    for (const object of objects) {
      if (!object.key) {
        continue;
      }

      const result = await getObject({ key: object.key });

      if (!attachments.find((attachment) => attachment.url === result.url)) {
        attachments.push({
          url: result.url,
          alt: result.name,
          file_name: result.name,
          file_type: result.content.type!,
          file_size: result.content.size!,
        });
      }
    }

    if (attachments.length > 0) {
      await cmsPressReleases.update(
        {
          id,
          params: {
            attachments: attachments.map((attachment) => ({
              url: attachment.url,
              alt: attachment.alt,
              file: {
                name: attachment.file_name,
                type: attachment.file_type as cmsPressReleases.Input.AttachmentFileType,
                size: attachment.file_size,
              },
            })),
          },
        },
        { token },
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(
        JSON.stringify(
          {
            attachments,
          },
          null,
          2,
        ),
      );
    }

    throw new Error("sync_failed");
  }
}

export { router };
