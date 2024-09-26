import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/api/trpc-router";

const url = process.env.TRPC_BATCH_LINK_URL;

if (!url) {
  throw new Error("TRPC_BATCH_LINK_URL is not set");
}

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url })],
});

export async function ping() {
  return await client.ping.query();
}
