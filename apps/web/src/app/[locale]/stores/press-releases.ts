import type {
  ListPressReleaseData,
  ListPressReleaseParams,
} from "@/api/hooks/query";
import { atom } from "jotai";

type ListPressReleaseParamKeys = (keyof ListPressReleaseParams)[];

function equal(
  a: ListPressReleaseParams,
  b: ListPressReleaseParams,
  exclude?: ListPressReleaseParamKeys,
) {
  const keys = Object.keys(a) as ListPressReleaseParamKeys;
  const included = keys.filter((key) => !exclude?.includes(key));
  return included.every(
    (key) => JSON.stringify(a[key]) === JSON.stringify(b[key]),
  );
}

export const isLoadingAtom = atom(false);
export const isInitialDataAtom = atom<boolean>(false);

const _dataAtom = atom<ListPressReleaseData | null>(null);
export const dataAtom = atom(
  (get) => get(_dataAtom),
  (get, set, data: ListPressReleaseData | null) => {
    set(_dataAtom, data);
    set(isInitialDataAtom, false); // data has changed
    set(isLoadingAtom, false);
  },
);

export const _paramsAtom = atom<ListPressReleaseParams>({});
export const paramsAtom = atom(
  (get) => get(_paramsAtom),
  (get, set, params: ListPressReleaseParams) => {
    const current = get(_paramsAtom);
    const isEmpty = Object.keys(params).length === 0;
    const updated: ListPressReleaseParams = isEmpty
      ? {}
      : {
          ...current,
          ...params,
          sort: params.startDate ? "asc" : "desc",
        };
    const isEqual = equal(current, updated, ["page"]);
    const hasPageChanged = current.page !== updated.page;

    // Auto-reset pagination if there are changes
    if (!isEqual) {
      updated.page = 1;
    }

    set(_paramsAtom, updated);
    set(isLoadingAtom, !isEqual || hasPageChanged);
  },
);
