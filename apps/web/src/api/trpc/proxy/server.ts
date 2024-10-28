import type { AppRouter } from "@repo/api/trpc-router";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

function getServerUrl() {
  if (typeof window !== "undefined") {
    throw new Error("This function should not be called on the client");
  }

  const url = process.env.TRPC_HTTP_BATCH_LINK_URL;

  if (!url) {
    throw new Error("TRPC_HTTP_BATCH_LINK_URL is not set");
  }

  return url;
}

// TODO: Deprecated
export function getTrpcServerClient() {
  return createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({ url: getServerUrl()! })],
  });
}
