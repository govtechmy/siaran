import { cmsFetch, CMSFetchError } from "#http";

type Session = {
  token: string;
  exp: number;
};

let session: Session | null = null;

export async function getToken() {
  if (session && session.exp && session.exp <= Date.now()) {
    session = await refreshToken(session.token);
  }

  if (!session) {
    session = await login();
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
