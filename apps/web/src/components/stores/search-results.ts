import type {
  ListPressReleaseData,
  ListPressReleaseParams,
} from "@/api/hooks/query";
import { create } from "zustand";

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

export const usePressReleasesStore = create<{
  isLoading: boolean;
  params: ListPressReleaseParams;
  data: ListPressReleaseData | null;
  setParams: (params: ListPressReleaseParams) => void;
  setData: (data: ListPressReleaseData | null) => void;
}>((set) => ({
  isLoading: false,
  params: {},
  data: null,
  setParams: (params) =>
    set((state) => {
      const updated = {
        params: {
          ...state.params,
          ...params,
        },
        isLoading: true,
      };

      // Reset pagination if there are changes
      if (!equal(state.params, updated.params, ["page"])) {
        updated.params.page = 1;
      }

      return updated;
    }),
  setData: (data) =>
    set((state) => {
      return { data, isLoading: false };
    }),
}));
