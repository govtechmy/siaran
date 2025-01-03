"use client";

import { Segment } from "@/components/hooks/view-segment";
import PressReleaseCardView from "@/components/PressReleaseCardView";
import PressReleaseListView from "@/components/PressReleaseListView";
import { Item } from "@/components/SegmentControl";
import type { PressRelease } from "@repo/api/cms/types";

export default function PressReleaseView({
  segment,
  data,
}: {
  segment: Item<Segment>;
  data: PressRelease[];
}) {
  switch (segment.id) {
    case "card":
      return <PressReleaseCardView data={data} />;
    case "list":
      return <PressReleaseListView data={data} />;
  }
}
