import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";

export default function UrgentTag({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "w-fit",
        "flex flex-row items-center gap-x-[0.5rem]",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full",
          "flex flex-row items-center gap-x-[.3125rem]",
          "bg-danger-50",
          "px-[.5rem] py-[.125rem]",
        )}
      >
        <span
          className={cn(
            "size-[0.5rem]",
            "rounded-full",
            "bg-danger-600",
            "animate-pulse-dot",
          )}
        ></span>
        <span className={cn("text-xs text-danger-600", "font-semibold")}>
          {t("common.pressRelease.labels.urgent")}
        </span>
      </div>
    </div>
  );
}
