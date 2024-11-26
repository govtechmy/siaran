import { ResponseError } from "#webhook/routers/errors.js";
import { logger } from "@repo/api/logging/logger";
import { NextFunction, Request, Response } from "express";
import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { z } from "zod";

type Payload = { exp: number; email: string };

interface ValidatedRequest<
  Body extends z.Schema,
  Params = unknown,
  Query = qs.ParsedQs,
> extends Request<Params, unknown, z.infer<Body>, Query> {}

interface AuthenticatedResponse<ResBody = unknown>
  extends Response<
    ResBody,
    {
      session: {
        token: string;
        email: string;
      };
    }
  > {}

function authenticate(
  req: Request,
  res: AuthenticatedResponse<ResponseError>,
  next: NextFunction,
): void | Promise<void> {
  const auth = req.headers["authorization"] ?? "";

  if (!auth.startsWith("Bearer")) {
    res.status(401).send({
      code: "missing_token",
      message: "Unauthorized: Bearer token is required",
    });
    return;
  }

  const [, token] = auth.split(" ");

  if (!token) {
    res.status(401).send({
      code: "invalid_token",
      message: "Unauthorized: Invalid bearer token",
    });
    return;
  }

  let payload: Payload | null = null;

  try {
    const { exp, email } = jwtDecode<Payload>(token);

    payload = { exp, email };
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.stack);
    }

    if (e instanceof InvalidTokenError) {
      res.status(401).send({
        code: "invalid_token",
        message: "Unauthorized: Invalid bearer token",
      });

      return;
    }

    res.status(500).send({
      code: "internal_server_error",
      message: "Internal Server Error",
    });

    return;
  }

  if (payload.exp * 1000 <= Date.now()) {
    res.status(401).send({
      code: "token_expired",
      message: "Unauthorized: Token has expired. Please log in again.",
    });
    return;
  }

  res.locals.session = { token, email: payload.email };

  next();
}

export { authenticate, type AuthenticatedResponse, type ValidatedRequest };
