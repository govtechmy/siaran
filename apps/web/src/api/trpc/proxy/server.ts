import type { AppRouter } from "@repo/api/trpc-router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const url = process.env.TRPC_HTTP_BATCH_LINK_URL;

if (typeof window !== "undefined") {
  throw new Error("This file should not be imported on the client");
}

if (!url) {
  throw new Error("TRPC_HTTP_BATCH_LINK_URL is not set");
}

// TODO: Deprecated
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: process.env.TRPC_HTTP_BATCH_LINK_URL! })],
});
