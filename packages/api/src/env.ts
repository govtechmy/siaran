export function getEnv() {
  return {
    CMS_PAYLOAD_URL: process.env.CMS_PAYLOAD_URL,
    CMS_PAYLOAD_LOGIN_EMAIL: process.env.CMS_PAYLOAD_LOGIN_EMAIL,
    CMS_PAYLOAD_LOGIN_PASSWORD: process.env.CMS_PAYLOAD_LOGIN_PASSWORD,
  };
}
