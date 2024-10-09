import { TRPCProvider } from "@/api/trpc/proxy/client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * A wrapper that reads and passes the tRPC batch link to the provider
 * @param props tRPC batch link URL
 * @returns
 */
export default async function QueryProvider(props: Props) {
  const url = process.env.TRPC_HTTP_BATCH_LINK_URL;

  if (!url) {
    throw new Error("TRPC_HTTP_BATCH_LINK_URL is not set");
  }

  return <TRPCProvider httpBatchLinkURL={url}>{props.children}</TRPCProvider>;
}
