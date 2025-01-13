import authenticateWithBasicAuth from "#middlewares/basic-auth.js";
import cors from "#middlewares/cors";
import helmet from "#middlewares/helmet";
import logRequest from "#middlewares/log-request";
import * as webhook from "#webhook/router";
import { createContext } from "@repo/api/trpc";
import { appRouter } from "@repo/api/trpc-router";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);
app.use(helmet);
app.use(cors);
app.use(authenticateWithBasicAuth);
app.use(
  "/api",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.use("/webhook", webhook.router);
app.use("/health", function checkHealth(_, res) {
  res.send("OK");
});

const port = parseInt(process.env.PORT || "8080");

app.listen(port, function start() {
  console.log(`Server is running on port ${port}`);
});
