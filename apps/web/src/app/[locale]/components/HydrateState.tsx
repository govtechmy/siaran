"use client";

import {
  ListPressReleaseData,
  ListPressReleaseParams,
} from "@/api/hooks/query";
import {
  dataAtom,
  isInitialDataAtom,
  paramsAtom,
} from "../stores/press-releases";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";
import { Segment } from "@/components/hooks/view-segment";

export type InitialParams = ListPressReleaseParams & {
  view?: Segment;
};

type Props = {
  state: {
    initialData: ListPressReleaseData;
    initialParams?: InitialParams;
  };
  children: ReactNode;
};

export default function HydrateState({
  state: { initialData, initialParams },
  children,
}: Props) {
  useHydrateAtoms([
    [paramsAtom, initialParams ?? {}],
    [dataAtom, initialData],
    [isInitialDataAtom, true],
  ] as const);

  return children;
}
