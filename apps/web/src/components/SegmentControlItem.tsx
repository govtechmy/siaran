import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export function Card({ isActive }: { isActive: boolean }) {
  const t = useTranslations();

  return (
    <Text isActive={isActive}>
      <SmallMediumScreen>{t("pages.index.view.card.short")}</SmallMediumScreen>
      <LargeScreen>{t("pages.index.view.card.long")}</LargeScreen>
    </Text>
  );
}

export function List({ isActive }: { isActive: boolean }) {
  const t = useTranslations();

  return (
    <Text isActive={isActive}>
      <SmallMediumScreen>{t("pages.index.view.list.short")}</SmallMediumScreen>
      <LargeScreen>{t("pages.index.view.list.long")}</LargeScreen>
    </Text>
  );
}

function Text({
  isActive,
  children,
}: {
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-base font-medium",
        "line-clamp-1 truncate",
        isActive ? "text-black-900" : "text-gray-dim-500",
      )}
    >
      {children}
    </span>
  );
}

function SmallMediumScreen({ children }: { children: ReactNode }) {
  return <span className={cn("flex lg:hidden")}>{children}</span>;
}

function LargeScreen({ children }: { children: ReactNode }) {
  return <span className={cn("hidden lg:flex")}>{children}</span>;
}
