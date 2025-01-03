"use client";

import GovBadge from "@/components/GovBadge";
import SearchFilterList, { Filters } from "@/components/SearchFilterList";
import SearchSuggestion from "@/components/SearchSuggestion";
import { useEffectMounted } from "@/components/hooks/mounted";
import { cn } from "@/lib/ui/utils";
import type { Agency } from "@repo/api/cms/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { isLoadingAtom, paramsAtom } from "../stores/press-releases";

type Props = {
  agencies: Agency[];
  className?: string;
};

export default function SearchHero({ agencies, className }: Props) {
  const t = useTranslations();
  const [, setParams] = useAtom(paramsAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [query, setQuery] = useState<string>();
  const [filters, setFilters] = useState<Filters>();

  function onSubmitQuery(newQuery: string) {
    if (query !== newQuery) {
      setQuery(newQuery);
    } else {
      resetParams();
    }
  }

  function resetParams() {
    setParams({
      page: 1,
      query,
      ...filters,
    });
  }

  useEffectMounted(
    function updateParams() {
      setParams({
        query,
        ...filters,
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
          agencies={agencies}
          onFiltersChange={setFilters}
          className={cn("mt-[.75rem]")}
        />
      </div>
    </section>
  );
}
