import { Segment } from "@/components/hooks/view-segment";
import { atom } from "jotai";

const _segmentAtom = atom<Segment>(
  (localStorage.getItem("page.index.state.segment") as Segment) || "card",
);
export const segmentAtom = atom(
  (get) => get(_segmentAtom),
  (get, set, segment: Segment) => {
    set(_segmentAtom, segment);
    localStorage.setItem("page.index.state.segment", segment);
  },
);
