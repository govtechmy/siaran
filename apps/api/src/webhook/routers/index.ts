import { authenticate } from "#middlewares/authenticate";
import { generator } from "#webhook/openapi";
import * as pressReleases from "#webhook/routers/press-releases/routes";
import * as users from "#webhook/routers/users/routes";
import express from "express";
import swaggerUi from "swagger-ui-express";

const router = express.Router();
router.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(
    generator.generateDocument({
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Webhook API",
        description: "Swagger docs",
      },
      servers: [{ url: "/" }],
    }),
  ),
);
router.use("/users", users.router);
router.use("/press-releases", authenticate, pressReleases.router);

export { router };
