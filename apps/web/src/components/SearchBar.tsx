import type { Agency } from "@/app/types/types";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import GovBadge from "@/components/GovBadge";
import SearchFilterList from "./SearchFilterList";
import SearchInput from "./SearchInput";

interface SearchBarProps {
  locale: Locale;
  agencies: Agency[];
}

export default async function SearchBar({ locale, agencies }: SearchBarProps) {
  const t = await getTranslations({ locale });

  return (
    <div
      className={cn(
        "relative",
        "h-fit w-full",
        "bg-[radial-gradient(117.1%_158.96%_at_50%_-58.96%,#FFD0A9_0%,#FFF6ED_100%)]",
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
          "absolute right-[5rem]",
          "[@media(max-width:1360px)]:hidden",
          "ml-auto",
        )}
      />
      <SearchInput className={cn("mt-[1.5rem]")} />
      <SearchFilterList className={cn("mt-[.75rem]")} agencies={agencies} />
    </div>
  );
}
