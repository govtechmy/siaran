"use client";

import { GetPressReleaseData, GetPressReleaseParams } from "@/api/hooks/query";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";
import {
  dataAtom,
  isInitialDataAtom,
  paramsAtom,
} from "../stores/press-release";

type Props = {
  state: {
    initialData: GetPressReleaseData;
    initialParams: GetPressReleaseParams;
  };
  children: ReactNode;
};

export default function HydrateState({
  state: { initialData, initialParams },
  children,
}: Props) {
  useHydrateAtoms(
    [
      [dataAtom, initialData],
      [paramsAtom, initialParams],
      [isInitialDataAtom, true],
    ] as const,
    {
      dangerouslyForceHydrate: true,
    },
  );

  return children;
}
