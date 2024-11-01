"use client";

import { Link } from "@/components/Link";
import NewTab from "@/icons/new-tab";
import { cn } from "@/lib/ui/utils";
import { useHover } from "@uidotdev/usehooks";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
};

export default function GovBadge({ className }: Props) {
  const t = useTranslations();
  const [ref, isHovering] = useHover<HTMLAnchorElement>();

  return (
    <Link
      className={cn(
        "rounded-full",
        "border border-transparent",
        "py-[.375rem]",
        "pl-[.6875rem] pr-[1rem]",
        "bg-white-force_white",
        "hover:border-gray-dim-500",
        "flex flex-row items-center justify-start gap-[.5rem]",
        "transition-all",
        "select-none",
        className,
      )}
      href={isHovering ? "https://www.digital.gov.my" : "#"}
      target="_blank"
      ref={ref}
    >
      <img
        className="h-[1.5rem] w-[1.875rem]"
        src="/jata-negara.png"
        alt="Jata Negara"
      />
      <div className="flex flex-col items-start">
        <div
          className={cn(
            "text-[.75rem] leading-[1rem]",
            "text-gray-dim-500",
            "font-normal",
          )}
        >
          {
            <span
              className={cn(
                {
                  "text-brand-600": isHovering,
                },
                "transition-all duration-200",
              )}
            >
              {isHovering
                ? t("components.GovBadge.labels.visitPortal")
                : t("components.GovBadge.labels.sponsor")}
            </span>
          }
        </div>
        <div className={cn("text-black-900", "text-sm", "font-medium")}>
          {t("components.GovBadge.labels.governmentOfMalaysia")}
        </div>
      </div>
      <NewTab
        className={cn(
          "text-gray-dim-500",
          "stroke-current",
          "transition-all duration-300 ease-in-out",
          "size-0 opacity-0",
          {
            "size-[.75rem] opacity-100": isHovering,
          },
        )}
      />
    </Link>
  );
}
