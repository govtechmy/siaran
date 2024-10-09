"use client";

import type { AppRouter } from "@repo/api/trpc-router";
import { isServer, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { ReactNode, useState } from "react";
import { getClientSideQueryClient, makeQueryClient } from "../../query-client";

type Props = {
  children: ReactNode;
  httpBatchLinkURL: string;
};

// Provide access to the procedures through useQuery() hook
export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider(props: Props) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: props.httpBatchLinkURL,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function getQueryClient() {
  if (isServer) {
    // use a new query client for each server request
    return makeQueryClient();
  }

  // use the same query client on the client
  return getClientSideQueryClient();
}
