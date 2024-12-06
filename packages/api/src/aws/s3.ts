import { getRegion } from "#aws/region";
import { logger } from "#logging/logger";
import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as path from "path";

let client: S3Client | null = null;

async function getClient() {
  if (client) {
    return client;
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.AWS_S3_ENDPOINT;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials not found");
  }

  client = new S3Client({
    region: getRegion(),
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
}

function getBucket() {
  const bucket = process.env.AWS_S3_BUCKET;

  if (bucket == null) {
    throw new Error("AWS bucket not found");
  }

  return bucket;
}

function getDomain() {
  const domain = process.env.R2_URL;

  if (!domain) {
    throw new Error("missing_r2");
  }

  return domain;
}

function getObjectUrl(key: string) {
  return new URL(key, getDomain()).href;
}

async function getUploadUrl({
  path,
  contentType,
}: {
  path: string;
  contentType: string;
}) {
  try {
    const client = await getClient();
    const command = new PutObjectCommand({
      Bucket: getBucket(),
      Key: path,
      ContentType: contentType,
    });

    return await getSignedUrl(client, command, { expiresIn: 3600 });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ path, contentType }));
    }

    throw new Error("get_upload_url_failed");
  }
}

async function getSignedObjectUrl({ key }: { key: string }) {
  try {
    const client = await getClient();
    const command = new GetObjectCommand({
      Bucket: getBucket(),
      Key: key,
    });

    return await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ key }));
    }

    throw new Error("get_object_url_failed");
  }
}

async function copyObjects({
  srcPrefix,
  destPrefix,
}: {
  srcPrefix: string;
  destPrefix: string;
}) {
  let files: Awaited<ReturnType<typeof listObjects>>;

  try {
    files = await listObjects({ prefix: srcPrefix });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ srcPrefix, destPrefix }));
    }

    throw new Error("move_failed");
  }

  if (!files || files.length === 0) {
    throw new Error("not_found");
  }

  for (const file of files) {
    let response: CopyObjectCommandOutput;

    if (!file.key) {
      continue;
    }

    try {
      const client = await getClient();
      const bucket = getBucket();
      const command = new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${file.key}`,
        Key: `${destPrefix}/${path.basename(file.key)}`,
      });

      response = await client.send(command);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.stack);
        logger.error(JSON.stringify({ srcPrefix, destPrefix }));
      }

      throw new Error("copy_failed");
    }
  }
}

async function listObjects({ prefix }: { prefix: string }) {
  let response: ListObjectsV2CommandOutput;

  try {
    const client = await getClient();
    const command = new ListObjectsV2Command({
      Bucket: getBucket(),
      Prefix: prefix,
    });

    response = await client.send(command);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ prefix }));
    }

    throw new Error("list_failed");
  }

  return (response.Contents ?? [])
    .map((object) => {
      if (!object.Key || !object.Size || !object.LastModified) {
        return null;
      }

      return {
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
      };
    })
    .filter((obj) => obj !== null);
}

async function getObject({ key }: { key: string }) {
  try {
    const client = await getClient();
    const response = await client.send(
      new GetObjectCommand({
        Bucket: getBucket(),
        Key: key,
      }),
    );

    return {
      url: getObjectUrl(key),
      name: path.basename(key),
      content: {
        type: response.ContentType,
        size: response.ContentLength,
      },
    };
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ key }));
    }

    throw new Error("get_failed");
  }
}

async function deleteObjects({ keys }: { keys: string[] }) {
  let response: DeleteObjectsCommandOutput;

  try {
    const client = await getClient();

    response = await client.send(
      new DeleteObjectsCommand({
        Bucket: getBucket(),
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      }),
    );
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ keys }));
    }

    throw new Error("delete_failed");
  }

  if (response.Deleted && response.Deleted.length === 0) {
    throw new Error("not_found");
  }
}

async function deleteObject({ key }: { key: string }) {
  try {
    const client = await getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: getBucket(),
        Key: key,
      }),
    );
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ key }));
    }

    throw new Error("delete_failed");
  }
}

export {
  getUploadUrl,
  getSignedObjectUrl,
  listObjects,
  copyObjects,
  getObject,
  getObjectUrl,
  deleteObject,
  deleteObjects,
};
