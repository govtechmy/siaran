import { mergePathname, mergeSearchParams } from "@/lib/search-params/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useMergeSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    mergeSearchParams(records: Record<string, string | undefined>) {
      router.replace(mergePathname(pathname, searchParams, records));
    },
    mergeSearchParamsHistory(records: Record<string, string | undefined>) {
      window.history.pushState(
        {},
        "",
        mergePathname(pathname, searchParams, records),
      );
    },
  };
}
