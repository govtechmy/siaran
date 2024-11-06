import { getRegion } from "#aws/region";
import { logger } from "#logging/logger";
import {
  DeleteObjectCommand,
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

    throw new Error("Unable to generate pre-signed URL");
  }
}

async function getObjectUrl({ key }: { key: string }) {
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

    throw new Error("Unable to get object URL");
  }
}

async function listObjects({ path }: { path: string }) {
  let response: ListObjectsV2CommandOutput;

  try {
    const client = await getClient();
    const command = new ListObjectsV2Command({
      Bucket: getBucket(),
      Prefix: path,
    });

    response = await client.send(command);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
      logger.error(JSON.stringify({ path }));
    }

    throw new Error("Unable to list objects");
  }

  const files = response.Contents?.map((object) => ({
    key: object.Key,
    size: object.Size,
    lastModified: object.LastModified,
  }));

  return files;
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

    const domain = process.env.R2_URL;

    if (!domain) {
      throw new Error("R2 URL not found");
    }

    return {
      url: path.join(domain, key),
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

    throw new Error("Unable to get object");
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

    throw new Error("Unable to delete object");
  }
}

export { getUploadUrl, getObjectUrl, listObjects, getObject, deleteObject };
