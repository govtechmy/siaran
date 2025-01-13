import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

export default function middleware(req: NextRequest) {
  const response = createMiddleware(routing)(req);

  if (process.env.HTTP_BASIC_AUTH !== "on") {
    return response;
  }

  const auth = req.headers.get("authorization");
  const basicAuthRequired = new NextResponse("Please authenticate", {
    headers: {
      ["WWW-Authenticate"]: `Basic realm="site", charset="UTF-8"`,
    },
    status: 401,
  });

  if (!auth) {
    return basicAuthRequired;
  }

  const [scheme, value] = auth.split(" ");

  if (scheme !== "Basic") {
    return basicAuthRequired;
  }

  const [username, password] = atob(value).split(":");

  if (
    username !== process.env.HTTP_BASIC_AUTH_USERNAME ||
    password !== process.env.HTTP_BASIC_AUTH_PASSWORD
  ) {
    return basicAuthRequired;
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en-MY|ms-MY)/:path*"],
};
