const { getSecret } = require("@repo/aws/secrets-manager");

export async function initDatabaseUri() {
  if (!!process.env.DATABASE_URI) {
    return;
  }

  const username = process.env.DATABASE_USERNAME;
  const password = await getDatabasePassword();
  const host = process.env.DATABASE_HOST;
  const port = process.env.DATABASE_PORT;
  const name = process.env.DATABASE_NAME;
  const options = process.env.DATABASE_OPTIONS;

  if (!username || !password || !host || !port || !name) {
    throw new Error("Missing database credentials");
  }

  const uri = `mongodb://${username}:${password}@${host}:${port}/${name}`;
  process.env.DATABASE_URI = options ? `${uri}?${options}` : uri;
}

async function getDatabasePassword() {
  // Use available secret if defined
  const secretName = process.env.DATABASE_SECRET_NAME;
  const password = process.env.DATABASE_PASSWORD;

  if (!secretName) {
    return password;
  }

  try {
    return await getSecret(secretName);
  } catch (error) {
    // Fallback to password if secret not found
  }

  return password;
}
