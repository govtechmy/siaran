"use client";

import type { PaginatedResponse, PressRelease } from "@/app/types/types";
import PressReleaseCard from "@/components/PressReleaseCard";
import PressReleaseList from "@/components/PressReleaseList";
import {
  type Item as SegmentControlItem,
  SegmentControl,
} from "@/components/SegmentControl";
import Pagination from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  response: PaginatedResponse<PressRelease>;
};

const SEGMENTS: SegmentControlItem[] = [
  { id: "card", label: "Card view" },
  { id: "list", label: "List view" },
];

export default function Content({ response }: Props) {
  const { docs: data, totalPages, page } = response;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [segment, setSegment] = useState<SegmentControlItem>(SEGMENTS[0]);

  function onPage(page: number) {
    if (page <= 0 || page >= totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
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
          "gap-[0.75rem] w-[80rem] h-[2rem]",
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
      {segment.id === "card" && (
      <section
        className={cn(
          "gap-[1.5rem]",
          "grid grid-cols-1 lg:grid-cols-3",
          "lg:col-span-[1/3] col-span-full",
        )}
      >
        {data.map((item, i) => (
          <PressReleaseCard key={i} data={item} />
        ))}
      </section>
    )}
    {segment.id === "list" && (
      <section>
        <PressReleaseList data={data} />
      </section>
    )}
        <section>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPage={onPage}
          />
        </section>

    </>
  );
}
