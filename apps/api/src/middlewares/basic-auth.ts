import type { NextFunction, Request, Response } from "express";

function setBasicAuthResponse(res: Response) {
  res.set("WWW-Authenticate", `Basic realm="api" charset="UTF-8"`);
  res.status(401).send("Please authenticate");
}

export default function authenticateWithBasicAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (process.env.HTTP_BASIC_AUTH !== "on") {
    next();
    return;
  }

  const auth = req.headers.authorization;

  if (!auth) {
    setBasicAuthResponse(res);
    return;
  }

  const [scheme, value] = auth.split(" ");

  if (scheme !== "Basic") {
    setBasicAuthResponse(res);
    return;
  }

  const [username, password] = atob(value).split(":");

  if (
    username !== process.env.HTTP_BASIC_AUTH_USERNAME ||
    password !== process.env.HTTP_BASIC_AUTH_PASSWORD
  ) {
    setBasicAuthResponse(res);
    return;
  }

  next();
}
