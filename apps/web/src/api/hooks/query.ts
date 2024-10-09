import { mergePathname } from "@/lib/search-params/utils";
import {
  PaginatedResponse,
  PaginatedSearchResponse,
  PressRelease,
} from "@repo/api/cms/types";
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProxyClient, useTRPCProxy } from "../trpc/proxy/client";

type QueryTypeMap = {
  ["pressRelease"]: PaginatedResponse<PressRelease>;
  ["search"]: PaginatedSearchResponse;
};

export function useTRPCQuery<QueryType extends keyof QueryTypeMap>({
  type,
  initialData,
  initialPage,
  queryKey = [],
  queryFn,
}: {
  type: QueryType;
  initialData: QueryTypeMap[QueryType];
  initialPage: number;
  queryKey?: QueryKey;
  queryFn: (
    trpc: ProxyClient[QueryType],
    options: { page: number },
  ) => Promise<QueryTypeMap[QueryType]>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trpc = useTRPCProxy();
  const [page, setPage] = useState(initialPage || 1);
  const { data, isLoading } = useSuspenseQuery<QueryTypeMap[QueryType]>({
    queryKey: [...queryKey, page],
    queryFn: () => queryFn(trpc[type], { page }),
    initialData: initialPage === page ? initialData : undefined,
  });

  function savePage(page: number) {
    // Keep the current page in the URL but don't re-render the page
    window.history.pushState(
      {},
      "",
      mergePathname(pathname, searchParams, { page: page.toString() }),
    );
  }

  return {
    data,
    isLoading,
    onPage(page: number) {
      savePage(page);
      setPage(page);
    },
  };
}

export async function listPressReleases() {}
