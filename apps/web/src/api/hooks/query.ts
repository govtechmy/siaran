import { useEffectMounted } from "@/components/hooks/mounted";
import type {
  Agency,
  PaginatedResponse,
  PaginatedSearchResponse,
  PressRelease,
  PressReleaseType,
  Sort,
} from "@repo/api/cms/types";
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProxyClient, useTRPCProxy } from "../trpc/proxy/client";

export type GetPressReleaseData = PressRelease;
export type GetPressReleaseParams = { id: string };

export type ListPressReleaseData = PaginatedResponse<PressRelease>;
export type ListPressReleaseParams = {
  page?: number;
  limit?: number;
  agencies?: string[];
  query?: string;
  type?: PressReleaseType;
  sort?: Sort["pressReleases"];
  startDate?: string;
  endDate?: string;
};

type Method<Params, Data> = {
  params: Params;
  data: Data;
};

export type Query = {
  ["pressRelease"]: {
    ["getById"]: Method<GetPressReleaseParams, GetPressReleaseData>;
    ["list"]: Method<ListPressReleaseParams, ListPressReleaseData>;
  };
  ["search"]: {
    ["all"]: Method<{ page: number }, PaginatedSearchResponse>;
  };
  ["agency"]: {
    ["list"]: Method<{ page: number }, Agency[]>;
  };
};

export function useTRPCQuery<
  Route extends keyof Query,
  Method extends keyof Query[Route],
  Data = Query[Route][Method] extends { data: infer T } ? T : never,
  Params = Query[Route][Method] extends { params: infer T } ? T : never,
>({
  route,
  method,
  initialData,
  params,
  queryKey = [],
  queryFn,
}: {
  route: Route;
  method: Method;
  initialData?: Data;
  params: Params;
  queryKey?: QueryKey;
  queryFn: (
    trpc: ProxyClient[Route][Method],
    options: { params: Params },
  ) => Promise<Data>;
}) {
  const [currentParams, setCurrentParams] = useState(params);
  const trpc = useTRPCProxy();
  const [shouldShowInitialData, setShouldShowInitialData] = useState(true);
  const { data, isLoading } = useSuspenseQuery<Data>({
    queryKey: [...queryKey, currentParams],
    queryFn: () => queryFn(trpc[route][method], { params: currentParams }),
    initialData: initialData && shouldShowInitialData ? initialData : undefined,
  });

  useEffectMounted(
    function updateParamsAndTriggerRefetch() {
      // Check content equality
      const hasChanged =
        JSON.stringify(params) !== JSON.stringify(currentParams);

      if (hasChanged) {
        setCurrentParams(params);
        setShouldShowInitialData(false);
      }
    },
    [params],
  );

  return {
    data,
    isLoading,
  };
}
