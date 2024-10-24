import { useEffectMounted } from "@/components/hooks/mounted";
import {
  Agency,
  PaginatedResponse,
  PaginatedSearchResponse,
  PressRelease,
  PressReleaseType,
} from "@repo/api/cms/types";
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProxyClient, useTRPCProxy } from "../trpc/proxy/client";

export type ListPressReleaseParams = {
  page?: number;
  limit?: number;
  agencies?: string[];
  query?: string;
  type?: PressReleaseType;
  startDate?: string;
  endDate?: string;
};

export type ListPressReleaseData = PaginatedResponse<PressRelease>;

export type QueryMap = {
  ["pressRelease"]: {
    params: ListPressReleaseParams;
    data: ListPressReleaseData;
  };
  ["search"]: {
    params: {
      page: number;
    };
    data: PaginatedSearchResponse;
  };
  ["agency"]: {
    params: {
      page: number;
    };
    data: Agency[];
  };
};

export function useTRPCQuery<T extends keyof QueryMap>({
  type,
  initialData,
  params,
  queryKey = [],
  queryFn,
}: {
  type: T;
  initialData?: QueryMap[T]["data"];
  params?: QueryMap[T]["params"];
  queryKey?: QueryKey;
  queryFn: (
    trpc: ProxyClient[T],
    options: { params: QueryMap[T]["params"] },
  ) => Promise<QueryMap[T]["data"]>;
}) {
  const [currentParams, setCurrentParams] = useState(params ?? { page: 1 });
  const trpc = useTRPCProxy();
  const [shouldShowInitialData, setShouldShowInitialData] = useState(true);
  const { data, isLoading } = useSuspenseQuery<QueryMap[T]["data"]>({
    queryKey: [...queryKey, currentParams],
    queryFn: () => queryFn(trpc[type], { params: currentParams }),
    initialData: initialData && shouldShowInitialData ? initialData : undefined,
  });

  useEffectMounted(
    function updateParamsAndTriggerRefetch() {
      setCurrentParams(params ?? { page: 1 });
      setShouldShowInitialData(
        JSON.stringify(params) === JSON.stringify(currentParams),
      );
    },
    [params],
  );

  // function saveParams(params: QueryMap[T]["params"]) {
  //   // Keep params in the URL but don't re-render the page
  //   window.history.pushState(
  //     {},
  //     "",
  //     mergePathname(
  //       pathname,
  //       searchParams,
  //       Object.entries(params).reduce((acc, [key, value]) => {
  //         if (Array.isArray(value)) {
  //           return { ...acc, [key]: value.join("|") };
  //         }
  //         return { ...acc, [key]: `${value}` };
  //       }, {}),
  //     ),
  //   );
  // }

  return {
    data: data || initialData,
    isLoading,
  };
}
