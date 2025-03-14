import { getRegion } from "./region";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

let client: SecretsManagerClient | null = null;

async function getClient() {
  if (client) {
    return client;
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials not found");
  }

  return new SecretsManagerClient({
    region: getRegion(),
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function getSecret(secretName: string) {
  try {
    const client = await getClient();
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    return response.SecretString;
  } catch (e) {
    if (e instanceof Error) {
      // TODO: logging
    }

    throw new Error("get_secret_failed");
  }
}
