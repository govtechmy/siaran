import type {
  AuthenticatedResponse,
  ValidatedRequest,
} from "#middlewares/authenticate";
import validateWithSchema from "#middlewares/validate-body";
import { ResponseError } from "#webhook/routers/errors";
import {
  deleteObject,
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
} from "@repo/api/cms/utils/attachment";
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
            res.status(401).send({
              code: "invalid_credential",
              message: "Unauthorized: Invalid credential",
            });

            return;
          case "not_found":
            res.status(401).send({
              code: "invalid_user",
              message: "Unauthorized: Invalid user",
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
        message: "Internal server error",
      });

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

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

      return;
    }

    if (!data) {
      res.status(404).send({
        code: "not_found",
        message: "Not Found",
      });

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

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

      return;
    }

    if (!user) {
      res.status(401).send({
        code: "invalid_user",
        message: "Unauthorized: Invalid user",
      });

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

    // Get all attachments from storage
    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        path: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

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

        res.status(500).send({
          code: "internal_server_error",
          message: "Internal server error",
        });

        return;
      }
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

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

      return;
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
              code: "invalid_press_release",
              message: "Not Found: Invalid press release",
            });

            return;
          default:
            break;
        }
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

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
            res.status(401).send({
              code: "invalid_user",
              message: "Unauthorized: Invalid user",
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

    res.status(200).send(
      await getUploadUrl({
        path: getPressReleaseAttachmentFilePath(id, req.body.filename),
        contentType: req.body.contentType,
      }),
    );
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
        message: "Internal server error",
      });

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
              code: "invalid_press_release",
              message: "Not Found: Invalid press release",
            });

            return;
          default:
            break;
        }
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

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
      res.status(404).send({
        code: "not_found",
        message: "Not found",
      });

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

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

      return;
    }

    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        path: getPressReleaseAttachmentPath(id),
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

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

        res.status(500).send({
          code: "internal_server_error",
          message: "Internal server error",
        });

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
              code: "invalid_press_release",
              message: "Not Found: Invalid press release",
            });

            return;
          default:
            break;
        }
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

      return;
    }

    // Sync up the metadata with the database
    let objects: Awaited<ReturnType<typeof listObjects>>;

    try {
      objects = await listObjects({
        path: getPressReleaseAttachmentPath(id),
      });

      if (objects) {
        let attachments = [] as Attachment[];

        // Get the metadata of each object
        for (const object of objects) {
          if (!object.key) {
            continue;
          }

          const result = await getObject({ key: object.key });

          attachments.push({
            url: result.url,
            alt: result.name,
            file_name: result.name,
            file_type: result.content.type!,
            file_size: result.content.size!,
          });
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
            { token: res.locals.session.token },
          );
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
      }

      res.status(500).send({
        code: "internal_server_error",
        message: "Internal server error",
      });

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

export { router };
