import { getRegion } from "#aws/region";
import { logger } from "#logging/logger";
import {
  AssumeRoleCommand,
  AssumeRoleResponse,
  STSClient,
} from "@aws-sdk/client-sts";

let client: STSClient | null = null;
let credentials: AssumeRoleResponse["Credentials"];

export async function getClient() {
  if (!client) {
    client = new STSClient({ region: getRegion() });
  }

  return client;
}

export function hasCredentialsExpired() {
  return (
    credentials &&
    credentials["Expiration"] &&
    credentials["Expiration"].getTime() < Date.now()
  );
}

export async function getCredentials() {
  if (
    credentials &&
    credentials["Expiration"] &&
    credentials["Expiration"].getTime() > Date.now()
  ) {
    return credentials;
  }

  try {
    const role = process.env.AWS_ROLE;

    if (role == null) {
      throw new Error("AWS role not found");
    }

    const client = await getClient();
    const response = await client.send(
      new AssumeRoleCommand({
        RoleArn: role,
        RoleSessionName: "SiaranSession",
      }),
    );

    if (!response.Credentials) {
      throw new Error("AWS credentials not found");
    }

    credentials = response.Credentials;
  } catch (e) {
    logger.error(e);
    throw new Error("Unable to obtain AWS credentials");
  }

  return credentials;
}
