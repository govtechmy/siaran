import "server-only";

import { createCallerFactory, createContext } from "@repo/api/trpc";
import { appRouter } from "@repo/api/trpc-router";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { makeQueryClient } from "../../query-client";

const caller = createCallerFactory(appRouter)(cache(createContext));

export const getQueryClient = cache(makeQueryClient);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
