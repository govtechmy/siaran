import { isServer, QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
  if (isServer) {
    // use a new query client for each server request
    return makeQueryClient();
  }

  // use the same query client on the client
  return getClientSideQueryClient();
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      //   dehydrate: {
      //     // serializeData: superjson.serialize,
      //     shouldDehydrateQuery: (query: Query) =>
      //       defaultShouldDehydrateQuery(query) ||
      //       query.state.status === "pending",
      //   },
      //   hydrate: {
      //     // deserializeData: superjson.deserialize,
      //   },
    },
  });
}

let clientSideQueryClient: QueryClient | undefined;

export function getClientSideQueryClient() {
  return (clientSideQueryClient ??= makeQueryClient());
}
