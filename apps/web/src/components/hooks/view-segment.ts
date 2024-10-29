import { type Item as SegmentControlItem } from "@/components/SegmentControl";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type Segment = "card" | "list";

const defaultSegment = "card" satisfies Segment;

export function useViewSegment(initialSegment?: Segment) {
  const t = useTranslations();
  const isSmallScreen = useMediaQuery("only screen and (max-width : 385px)");

  const segmentsById = {
    card: {
      id: "card",
      label: t(
        isSmallScreen
          ? "pages.index.view.card.short"
          : "pages.index.view.card.long",
      ),
    },
    list: {
      id: "list",
      label: t(
        isSmallScreen
          ? "pages.index.view.list.short"
          : "pages.index.view.list.long",
      ),
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
