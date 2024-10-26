"use client";

import GovBadge from "@/components/GovBadge";
import { Filters } from "@/components/SearchFilterList";
import SearchSuggestion from "@/components/SearchSuggestion";
import { useEffectMounted } from "@/components/hooks/mounted";
import { paramsAtom } from "@/components/stores/press-releases";
import { cn } from "@/lib/ui/utils";
import type { Agency } from "@repo/api/cms/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useState } from "react";
import SearchFilterListProxy from "./SearchFilterListProxy";

type Props = {
  agencies: Agency[];
  className?: string;
};

export default function SearchHero({ agencies, className }: Props) {
  const t = useTranslations();
  const [, setParams] = useAtom(paramsAtom);
  const [query, setQuery] = useState<string>();
  const [filters, setFilters] = useState<Filters>();

  useEffectMounted(
    function clearParamsIfQueryIsEmpty() {
      setParams(
        query
          ? {
              query,
              ...filters,
            }
          : {},
      );
    },
    [filters, query],
  );

  return (
    <section
      className={cn(
        "relative",
        "h-fit w-full",
        "bg-[radial-gradient(117.1%_158.96%_at_50%_-58.96%,#FFD0A9_0%,#FFF6ED_100%)]",
        "px-[1.5rem] py-[3rem]",
        "flex flex-col items-center",
        className,
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
          "absolute right-[5rem]",
          "[@media(max-width:1360px)]:hidden",
          "ml-auto",
        )}
      />
      <SearchSuggestion
        className={cn("mt-[1.5rem]")}
        onClearQuery={() => setQuery("")}
        onSubmitQuery={setQuery}
      />
      <SearchFilterListProxy
        agencies={agencies}
        onFiltersChange={setFilters}
        className={cn("mt-[.75rem]")}
      />
    </section>
  );
}
