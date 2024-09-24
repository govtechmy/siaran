import type { PressReleaseType } from "@/app/types/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  type: PressReleaseType;
};

export default function PressReleaseTag({ type }: Props) {
  const t = useTranslations();

  return (
    <span
      className={cn(
        "mb-[0.25rem]",
        "text-sm font-semibold",
        type === "kenyataan_media"
          ? "text-success-700"
          : type === "ucapan"
            ? "text-warning-700"
            : "text-black-700",
      )}
    >
      {type === "kenyataan_media"
        ? t("common.pressRelease.types.mediaRelease")
        : type === "ucapan"
          ? t("common.pressRelease.types.speech")
          : t("common.pressRelease.types.other")}
    </span>
  );
}
