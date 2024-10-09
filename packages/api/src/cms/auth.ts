import { cmsFetch, CMSFetchError } from "#http";

type Session = {
  token: string;
  exp: number;
};

let session: Session | null = null;

export async function getToken() {
  const now = Date.now();

  if (!session || (session && now >= session.exp)) {
    session = await login();
  } else {
    session = await refreshToken(session.token);
  }

  return session.token;
}

export async function login(): Promise<Session> {
  try {
    const { exp, token } = await cmsFetch<{ exp: number; token: string }>(
      "/api/users/login",
      {
        method: "POST",
        body: {
          email: process.env.CMS_PAYLOAD_LOGIN_EMAIL,
          password: process.env.CMS_PAYLOAD_LOGIN_PASSWORD,
        },
      }
    );

    return { exp: Date.now(), token };
  } catch (e) {
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to login: ${e.message ?? ""} ${e.statusCode ?? ""}`
      );
    }
    throw e;
  }
}

/**
 * Refresh the access token
 *
 * @param a a non-expired token
 */
export async function refreshToken(token: string): Promise<Session> {
  try {
    const { exp, refreshedToken } = await cmsFetch<{
      exp: number;
      refreshedToken: string;
    }>("/api/users/refresh-token", {
      method: "POST",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    return { exp, token: refreshedToken };
  } catch (e) {
    if (e instanceof CMSFetchError) {
      console.error(
        `Failed to refresh token: ${e.message ?? ""} ${e.statusCode ?? ""}`
      );
    }
    throw e;
  }
}
