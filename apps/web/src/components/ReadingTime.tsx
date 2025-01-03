import Clock from "@/icons/clock";
import { getReadingTime } from "@/lib/text/utils";
import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";

export default function ReadingTime({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const t = useTranslations();

  if (text == "") {
    return null;
  }

  return (
    <div
      className={cn(
        "h-[1.25rem] w-fit",
        "flex flex-row items-center gap-x-[0.25rem]",
        "text-gray-dim-500",
        "overflow-x-hidden",
        className,
      )}
    >
      <Clock className={cn("size-[1rem]", "stroke-current")} />
      <span className={cn("text-sm", "font-normal", "line-clamp-1 truncate")}>
        {t.rich("common.readingTime.labels.minutes", {
          minutes: getReadingTime(text),
        })}
      </span>
    </div>
  );
}
