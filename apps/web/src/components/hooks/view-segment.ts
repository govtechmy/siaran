import { type Item as SegmentControlItem } from "@/components/SegmentControl";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type Segment = "card" | "list";

const defaultSegment = "card" satisfies Segment;

export function useViewSegment(initialSegment?: Segment) {
  const t = useTranslations();
  const segmentsById = {
    card: {
      id: "card",
      label: t("pages.index.view.card"),
    },
    list: {
      id: "list",
      label: t("pages.index.view.list"),
    },
  } satisfies Record<Segment, SegmentControlItem>;
  const [active, setActive] = useState<SegmentControlItem>(
    segmentsById[initialSegment || defaultSegment],
  );

  return {
    segments: Object.values(
      Object.values(segmentsById),
    ) as SegmentControlItem[],
    active,
    onSegment(segment: SegmentControlItem) {
      setActive(segment);
    },
  };
}
