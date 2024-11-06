import { Segment } from "@/components/hooks/view-segment";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage<Segment>(function getStorage() {
  return localStorage;
});

export const segmentAtom = atomWithStorage<Segment>(
  "page.index.state.segment",
  "card",
  storage,
  { getOnInit: true },
);
