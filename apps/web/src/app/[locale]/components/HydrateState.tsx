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

type Props = {
  state: {
    initialData: ListPressReleaseData;
    initialParams?: ListPressReleaseParams;
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
