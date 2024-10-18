"use client";

import { useTRPCQuery } from "@/api/hooks/query";
import PressReleaseCardView from "@/components/PressReleaseCardView";
import PressReleaseListView from "@/components/PressReleaseListView";
import {
  type Item as SegmentControlItem,
  SegmentControl,
} from "@/components/SegmentControl";
import Pagination from "@/components/base/pagination";
import { cn } from "@/lib/utils";
import type { PaginatedResponse, PressRelease } from "@repo/api/cms/types";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

type Props = {
  initialData: PaginatedResponse<PressRelease>;
  segment?: "card" | "list";
};

export default function Content({
  initialData,
  segment: initialSegment,
}: Props) {
  const t = useTranslations();
  const { data, onPage } = useTRPCQuery({
    type: "pressRelease",
    initialData,
    initialPage: initialData.page,
    queryFn: async (trpc, { page }) => trpc.list.query({ page }),
  });

  const segments: SegmentControlItem[] = [
    { id: "card", label: t("pages.index.view.card") },
    { id: "list", label: t("pages.index.view.list") },
  ];

  const [segment, setSegment] = useState<SegmentControlItem>(
    getSegmentById(initialSegment),
  );

  function getSegmentById(segmentId?: string) {
    const defaultSegment = segments[1];

    if (!segmentId || (segmentId !== "card" && segmentId !== "list")) {
      return defaultSegment;
    }

    switch (segmentId) {
      case "card":
        return defaultSegment;
      case "list":
        return segments[1];
    }
  }

  function onSegment(segment: SegmentControlItem): void {
    setSegment(segment);
  }

  return (
    <>
      <section
        className={cn(
          "mb-[1rem] mt-[1.5rem]",
          "lg:mb-[1.75rem] lg:mt-[3rem]",
          "flex items-center justify-between",
          "h-[2rem] w-full gap-[0.75rem]",
        )}
      >
        <h2 className={cn("text-base font-medium text-black-700")}>
          {t("pages.index.latestReleases")}
        </h2>
        <SegmentControl
          items={segments}
          active={segment}
          onSegment={onSegment}
        />
      </section>
      <Suspense>
        <section>
          <PressReleaseView segment={segment} data={data.docs} />
          <Pagination
            currentPage={data.page || 1}
            totalPages={data.totalPages || 1}
            onPage={onPage}
          />
        </section>
      </Suspense>
    </>
  );
}

function PressReleaseView({
  segment,
  data,
}: {
  segment: SegmentControlItem;
  data: PressRelease[];
}) {
  switch (segment.id) {
    case "card":
      return <PressReleaseCardView data={data} />;
    case "list":
      return <PressReleaseListView data={data} />;
  }
}
