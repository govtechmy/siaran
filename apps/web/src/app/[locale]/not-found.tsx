import Container from "@/components/Container";
import RoundedTag from "@/components/RoundedTag";
import ThemeButton from "@/components/ThemeButton";
import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";

export default function PageNotFound() {
  const t = useTranslations();

  return (
    <main className={cn("h-[70vh]")}>
      <Container
        className={cn("h-full", "flex flex-col items-center justify-center")}
      >
        <RoundedTag>{t("common.http.404")}</RoundedTag>
        <h1
          className={cn(
            "mt-[1.5rem]",
            "text-2xl font-semibold text-black-900 lg:text-3xl",
            "text-center",
          )}
        >
          {t("pages.notFound.titles.main")}
        </h1>
        <p className={cn("mt-[1rem]", "text-black-700", "text-center")}>
          {t("pages.notFound.descriptions.main")}
        </p>
        <ThemeButton href="/" className={cn("mt-[1.5rem] md:mt-[2.5rem]")}>
          {t("pages.notFound.labels.return")}
        </ThemeButton>
      </Container>
    </main>
  );
}
