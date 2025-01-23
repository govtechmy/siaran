export function getServiceStorageName() {
  return process.env.SERVICE_STORAGE;
}

export function getS3AuthMethod() {
  return process.env.AWS_S3_AUTH_METHOD;
}
