"use client";

import type { PressRelease } from "@/app/types/types";
import PressReleaseCardView from "@/components/PressReleaseCardView";
import PressReleaseListView from "@/components/PressReleaseListView";
import {
  type Item as SegmentControlItem,
  SegmentControl,
} from "@/components/SegmentControl";
import Pagination from "@/components/ui/pagination";
import { mergePathname } from "@/lib/search-params/utils";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  data: PressRelease[];
  segment?: "card" | "list";
  pagination: {
    current: number;
    hasNext: boolean;
    hasPrev: boolean;
    total: number;
  };
};

const SEGMENTS: SegmentControlItem[] = [
  { id: "card", label: "Card view" },
  { id: "list", label: "List view" },
];

export default function Content({
  data,
  segment: initialSegment,
  pagination,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [segment, setSegment] = useState<SegmentControlItem>(
    getSegmentById(initialSegment) || SEGMENTS[0],
  );

  function onPage(page: number) {
    router.push(
      mergePathname(pathname, searchParams, { page: page.toString() }),
    );
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
          "h-[2rem] w-[80rem] gap-[0.75rem]",
        )}
      >
        <h2 className={cn("text-base font-medium text-black-700")}>
          Latest Releases
        </h2>
        <SegmentControl
          items={SEGMENTS}
          active={segment}
          onSegment={onSegment}
        />
      </section>
      <section>
        <PressReleaseView segment={segment} data={data} />
        <Pagination
          currentPage={pagination.current}
          totalPages={pagination.total}
          onPage={onPage}
        />
      </section>
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

function getSegmentById(segmentId?: string) {
  const defaultSegment = SEGMENTS[0];

  if (!segmentId || (segmentId !== "card" && segmentId !== "list")) {
    return defaultSegment;
  }

  switch (segmentId) {
    case "card":
      return defaultSegment;
    case "list":
      return SEGMENTS[1];
  }
}
