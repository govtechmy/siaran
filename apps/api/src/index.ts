import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@repo/api/trpc-router";
import { Hono } from "hono";

const app = new Hono();

app.use(
  "/api/*",
  trpcServer({
    router: appRouter,
  })
);

const port = parseInt(process.env.PORT || "8080");
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
