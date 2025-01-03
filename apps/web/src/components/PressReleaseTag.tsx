import { cn } from "@/lib/ui/utils";
import type { PressReleaseType } from "@repo/api/cms/types";
import { useTranslations } from "next-intl";

type Props = {
  type: PressReleaseType;
  className?: string;
};

export default function PressReleaseTag({ type, className }: Props) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "w-fit",
        "text-sm font-semibold",
        type === "kenyataan_media"
          ? "text-success-700"
          : type === "ucapan"
            ? "text-warning-700"
            : "text-black-700",
        "break-words",
        "truncate",
        className,
      )}
    >
      {type === "kenyataan_media"
        ? t("common.pressRelease.types.mediaRelease")
        : type === "ucapan"
          ? t("common.pressRelease.types.speech")
          : t("common.pressRelease.types.other")}
    </div>
  );
}
