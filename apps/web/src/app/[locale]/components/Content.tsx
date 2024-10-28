"use client";

import {
  type ListPressReleaseData,
  type ListPressReleaseParams,
  useTRPCQuery,
} from "@/api/hooks/query";
import PressReleaseView from "@/components/PressReleaseView";
import {
  SegmentControl,
  type Item as SegmentControlItem,
} from "@/components/SegmentControl";
import Pagination from "@/components/base/pagination";
import { Skeleton } from "@/components/base/skeleton";
import { type Segment, useViewSegment } from "@/components/hooks/view-segment";
import {
  dataAtom,
  isInitialDataAtom,
  isLoadingAtom,
  paramsAtom,
} from "@/components/stores/press-releases";
import { cn } from "@/lib/ui/utils";
import type { PaginatedResponse, PressRelease } from "@repo/api/cms/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Suspense, useEffect } from "react";

type Props = {
  initialSegment?: Segment;
};

export default function Content({ initialSegment }: Props) {
  const t = useTranslations();
  const { segments, active, onSegment } = useViewSegment(initialSegment);

  const [data, setData] = useAtom(dataAtom);
  const isInitialData = useAtom(isInitialDataAtom);
  const [params, setParams] = useAtom(paramsAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const isSearching = !!params.query;

  if (!data) {
    return <></>;
  }

  return (
    <>
      {!isLoading && (
        <section
          className={cn(
            "mb-[1rem] mt-[1.5rem]",
            "lg:mb-[1.75rem] lg:mt-[3rem]",
            "flex items-center justify-between",
            "h-fit w-full gap-[0.75rem]",
          )}
        >
          <div className={cn("flex flex-col gap-y-[1.5rem]", "flex-1")}>
            <h2 className={cn("text-base font-medium text-black-700")}>
              {isSearching
                ? t.rich("pages.index.searchResults.count", {
                    count: data.totalDocs,
                    query: () => <span>{params.query}</span>,
                  })
                : t("pages.index.latestReleases")}
            </h2>
            {isSearching && data.totalDocs === 0 && (
              <p className={cn("text-base font-normal text-gray-dim-500")}>
                {t("pages.index.searchResults.notFound")}
              </p>
            )}
          </div>
          {data.totalDocs > 0 && !isLoading && (
            <SegmentControl
              items={segments}
              active={active}
              onSegment={onSegment}
            />
          )}
        </section>
      )}
      <Suspense fallback={<Loading />}>
        <Data
          initialData={isInitialData && data}
          params={params}
          segment={active}
          onDataChange={setData}
          onPageChange={(page) => setParams({ page })}
        />
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-4",
        "px-[1rem] py-[2rem]",
      )}
    >
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
      <Skeleton className={cn("h-6 w-full max-w-[50rem]")} />
    </div>
  );
}

function Data({
  initialData,
  params,
  segment,
  onDataChange,
  onPageChange,
}: {
  initialData: PaginatedResponse<PressRelease>;
  params?: ListPressReleaseParams;
  segment: SegmentControlItem;
  onDataChange?: (data: ListPressReleaseData) => void;
  onPageChange?: (page: number) => void;
}) {
  const { data } = useTRPCQuery({
    type: "pressRelease",
    initialData,
    params,
    queryFn: async (trpc, { params }) => trpc.list.query(params),
  });

  useEffect(() => onDataChange?.(data), [onDataChange, data]);

  return (
    <section className={cn("w-full", "flex flex-col")}>
      <PressReleaseView segment={segment} data={data.docs} />
      {data.totalDocs > 0 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPage={(page) => onPageChange?.(page)}
        />
      )}
    </section>
  );
}
