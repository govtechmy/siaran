import "dotenv/config";

import cors from "#logging/middlewares/cors";
import helmet from "#logging/middlewares/helmet";
import logRequest from "#logging/middlewares/log-request";
import { createContext } from "@repo/api/trpc";
import { appRouter } from "@repo/api/trpc-router";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";

const app = express();
app.use(logRequest);
app.use(helmet);
app.use(cors);
app.use(
  "/api",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = parseInt(process.env.PORT || "8080");

app.listen(port, function start() {
  console.log(`Server is running on port ${port}`);
});
