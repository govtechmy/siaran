"use client";

import { type Item as SegmentControlItem } from "@/components/SegmentControl";
import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

export type Segment = "card" | "list";

const defaultSegment = "card" satisfies Segment;

export function useViewSegment(initialSegment?: Segment) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const searchParamSegment = searchParams.get("view");

  const segmentsById = {
    card: {
      id: "card",
      getLabel: ({ isActive }) => {
        return <Card isActive={isActive} />;
      },
    },
    list: {
      id: "list",
      getLabel({ isActive }) {
        return <List isActive={isActive} />;
      },
    },
  } satisfies Record<Segment, SegmentControlItem<Segment>>;

  const [active, setActive] = useState<SegmentControlItem<Segment>>(
    // use provided segment
    (initialSegment && segmentsById[initialSegment]) ||
      // or, use search param segment
      (isSegment(searchParamSegment) && segmentsById[searchParamSegment]) ||
      // or, use default segment
      segmentsById[defaultSegment],
  );

  return {
    segments: Object.values(
      Object.values(segmentsById),
    ) as SegmentControlItem<Segment>[],
    active,
    onSegment(segment: SegmentControlItem<Segment>) {
      setActive(segment);
    },
  };
}

function isSegment(string: string | null): string is Segment {
  return string != null && ["card", "list"].includes(string);
}

function Card({ isActive }: { isActive: boolean }) {
  const t = useTranslations();

  return (
    <Text isActive={isActive}>
      <SmallMediumScreen>{t("pages.index.view.card.short")}</SmallMediumScreen>
      <LargeScreen>{t("pages.index.view.card.long")}</LargeScreen>
    </Text>
  );
}

function List({ isActive }: { isActive: boolean }) {
  const t = useTranslations();

  return (
    <Text isActive={isActive}>
      <SmallMediumScreen>{t("pages.index.view.list.short")}</SmallMediumScreen>
      <LargeScreen>{t("pages.index.view.list.long")}</LargeScreen>
    </Text>
  );
}

function Text({
  isActive,
  children,
}: {
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-base font-medium",
        "line-clamp-1 truncate",
        isActive ? "text-black-900" : "text-gray-dim-500",
      )}
    >
      {children}
    </span>
  );
}

function SmallMediumScreen({ children }: { children: ReactNode }) {
  return <span className={cn("flex lg:hidden")}>{children}</span>;
}

function LargeScreen({ children }: { children: ReactNode }) {
  return <span className={cn("hidden lg:flex")}>{children}</span>;
}
