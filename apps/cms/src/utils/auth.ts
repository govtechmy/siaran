import { PayloadHandler } from "payload/config";

export function isAuthenticated(handler: PayloadHandler) {
  return async function (req, res, next) {
    if (req.user) {
      handler(req, res, next);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } as PayloadHandler;
}
