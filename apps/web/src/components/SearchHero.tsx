import GovBadge from "@/components/GovBadge";
import SearchFilterList from "@/components/SearchFilterList";
import SearchSuggestion from "@/components/SearchSuggestion";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Agency } from "@repo/api/cms/types";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: Locale;
  agencies: Agency[];
  className?: string;
};

export default async function SearchHero({
  locale,
  agencies,
  className,
}: Props) {
  const t = await getTranslations({ locale });

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
      <SearchSuggestion className={cn("mt-[1.5rem]")} />
      <SearchFilterList className={cn("mt-[.75rem]")} agencies={agencies} />
    </section>
  );
}
