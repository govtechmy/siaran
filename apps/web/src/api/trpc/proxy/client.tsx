"use client";

import { getQueryClient } from "@/api/query-client";
import { AppRouter } from "@repo/api/trpc-router";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCProxyClient,
  httpBatchLink,
  HTTPHeaders,
} from "@trpc/client";
import { createContext, ReactNode, useContext } from "react";

type Props = {
  httpBatchLinkURL: string;
  headers?: HTTPHeaders;
  children: ReactNode;
};

export type ProxyClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>;

export const ProxyClientProvider = createContext<ProxyClient | never>(
  null as never,
);

export function useTRPCProxy() {
  return useContext(ProxyClientProvider);
}

export function TRPCProvider(props: Props) {
  const queryClient = getQueryClient();
  const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: props.httpBatchLinkURL,
        headers() {
          return props.headers ?? {};
        },
      }),
    ],
  });

  return (
    <ProxyClientProvider.Provider value={trpcClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </ProxyClientProvider.Provider>
  );
}
