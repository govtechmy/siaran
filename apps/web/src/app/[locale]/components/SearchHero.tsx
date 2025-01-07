"use client";

import GovBadge from "@/components/GovBadge";
import SearchFilterList, { Filters } from "@/components/SearchFilterList";
import SearchSuggestion from "@/components/SearchSuggestion";
import { useEffectMounted } from "@/components/hooks/mounted";
import { useMergeSearchParams } from "@/components/hooks/search-params";
import { cn } from "@/lib/ui/utils";
import type { Agency } from "@repo/api/cms/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { isLoadingAtom, paramsAtom } from "../stores/press-releases";

type Props = {
  agencies: Agency[];
  className?: string;
};

export default function SearchHero({ agencies, className }: Props) {
  const t = useTranslations();
  const [params, setParams] = useAtom(paramsAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [query, setQuery] = useState<string>();
  const [filters, setFilters] = useState<Filters>({
    // select agencies based on the provided agency IDs
    agencies: Array.isArray(params.agencies)
      ? agencies.filter((agency) =>
          params.agencies!.find((id) => id === agency.id),
        )
      : [],
    type: params.type,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const { mergeSearchParamsHistory } = useMergeSearchParams();

  function onSubmitQuery(newQuery: string) {
    if (query !== newQuery) {
      setQuery(newQuery);
    } else {
      resetParams();
    }
  }

  // Map filters into serializable format
  function mapFiltersIntoParams(
    filters: Filters,
  ): Omit<Filters, "agencies"> & { agencies?: string[] } {
    return {
      agencies:
        filters.agencies &&
        filters.agencies.length > 0 &&
        filters.agencies.length !== agencies.length
          ? filters.agencies?.map((agency) => agency.id)
          : undefined,
      type: filters.type,
      startDate: filters.startDate,
      endDate: filters.endDate,
    };
  }

  function resetParams() {
    setParams({
      page: 1,
      query,
      ...mapFiltersIntoParams(filters),
    });
  }

  useEffect(
    function persistFilters() {
      const serialized = mapFiltersIntoParams(filters);

      mergeSearchParamsHistory({
        agencies: serialized.agencies?.join("|"),
        type: serialized.type,
        startDate: serialized.startDate,
        endDate: serialized.endDate,
      });
    },
    [filters],
  );

  useEffectMounted(
    function updateParams() {
      setParams({
        query,
        ...mapFiltersIntoParams(filters),
      });
    },
    [filters, query],
  );

  return (
    <section
      className={cn(
        "bg-[radial-gradient(117.1%_158.96%_at_50%_-58.96%,#FFD0A9_0%,#FFF6ED_100%)]",
        className,
      )}
    >
      <div
        className={cn(
          "container",
          "relative",
          "min-h-[17.5rem] w-full md:min-h-[15rem]",
          "px-[1.5rem] py-[3rem]",
          "flex flex-col items-center",
        )}
      >
        <h1
          className={cn(
            "mx-auto",
            "text-start md:text-center",
            "text-2xl text-theme-text_hero",
            "font-semibold",
          )}
        >
          {t("pages.index.titles.hero")}
        </h1>
        <GovBadge
          className={cn(
            "absolute right-0 top-[3rem]",
            "[@media(max-width:1360px)]:hidden",
            "ml-auto",
          )}
        />
        <SearchSuggestion
          className={cn("mt-[1.5rem]")}
          onClearQuery={() => setQuery("")}
          onSubmitQuery={onSubmitQuery}
          isLoading={isLoading}
        />
        <SearchFilterList
          initialData={filters}
          agencies={agencies}
          onFiltersChange={setFilters}
          className={cn("mt-[.75rem]")}
        />
      </div>
    </section>
  );
}
