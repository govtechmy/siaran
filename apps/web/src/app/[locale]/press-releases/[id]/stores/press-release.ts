import type {
  GetPressReleaseData,
  GetPressReleaseParams,
} from "@/api/hooks/query";
import { atom } from "jotai";

export const isLoadingAtom = atom(false);
export const isInitialDataAtom = atom<boolean>(false);
export const paramsAtom = atom<GetPressReleaseParams | null>(null);
export const dataAtom = atom<GetPressReleaseData | null>(null);
