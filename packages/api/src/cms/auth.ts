import type { Session } from "#cms/schema/session";
import { login, refreshToken } from "#cms/users";

let session: Session | null = null;

export async function getToken() {
  const now = Date.now();

  if (!session || now >= session.exp) {
    session = await login({
      email: process.env.CMS_PAYLOAD_LOGIN_EMAIL!,
      password: process.env.CMS_PAYLOAD_LOGIN_PASSWORD!,
    });
  } else {
    session = await refreshToken({
      token: session.token,
    });
  }

  return session.token;
}
