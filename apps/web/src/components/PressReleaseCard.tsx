import { Link } from "@/components/Link";
import PressReleaseTag from "@/components/PressReleaseTag";
import ReadingTime from "@/components/ReadingTime";
import Separator from "@/components/Separator";
import UrgentTag from "@/components/UrgentTag";
import { useAppLocale } from "@/i18n/routing";
import NewTab from "@/icons/new-tab";
import { getContent } from "@/lib/data/press-release";
import { cn } from "@/lib/ui/utils";
import { getLocalizedURL } from "@/lib/url/utils";
import type { PressRelease } from "@repo/api/cms/types";
import { useHover } from "@uidotdev/usehooks";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";

type Props = {
  data: PressRelease;
};

export default function PressReleaseCard({ data }: Props) {
  const t = useTranslations();
  const [ref, isHovering] = useHover<HTMLAnchorElement>();
  const date = parseISO(data.date_published);
  const isStartOfDay = data && date.getHours() === 0 && date.getMinutes() === 0;
  const locale = useAppLocale();
  const content = getContent(data);

  return (
    <Link
      ref={ref}
      href={getLocalizedURL(locale, "press-releases", data.id)}
      className={cn(
        "rounded-[0.75rem]",
        "border border-gray-outline-200 hover:border-gray-outline-300",
        "flex flex-col gap-y-[0.5rem]",
        "p-[1.5rem]",
        "hover:shadow-card",
        "overflow-hidden",
      )}
    >
      <div
        className={cn(
          "mb-[.25rem]",
          "flex flex-row items-center gap-x-[0.5rem]",
        )}
      >
        <PressReleaseTag type={data.type} className={cn("shrink-1")} />
        <div
          className={cn("flex flex-row items-start gap-x-[0.5rem]", {
            [cn("hidden")]: !isHovering,
          })}
        >
          <Separator type="pipe" />
          <ReadingTime text={content} />
        </div>
        {data.priority === "high" && <UrgentTag className="ml-auto" />}
      </div>
      <div
        className={cn(
          "text-base font-semibold text-black-900",
          "line-clamp-3 md:line-clamp-1 lg:line-clamp-2",
        )}
      >
        {data.title}
      </div>
      <p
        className={cn(
          "text-sm font-normal text-black-700",
          "line-clamp-2 lg:line-clamp-3",
        )}
      >
        {content}
      </p>
      <div
        className={cn(
          "mt-auto",
          "w-full",
          "pt-[0.5rem]",
          "flex flex-row items-center gap-x-[0.5rem]",
          "text-sm",
        )}
      >
        <div className="font-medium text-gray-dim-500">
          {data.relatedAgency.acronym}
        </div>
        <Separator type="bullet" />
        {data.date_published && (
          <div className={cn("flex-1", "text-gray-dim-500", "truncate")}>
            {format(date, isStartOfDay ? "d MMM yyyy" : "d MMM yyyy, h:mm a")}
          </div>
        )}
        <div
          className={cn(
            "w-0",
            "flex-0",
            "ml-auto",
            "flex flex-row items-center gap-x-[.5rem]",
            "text-brand-600",
            "overflow-hidden",
            "translate-y-[3rem] opacity-0",
            "transition-all duration-300 ease-in-out",
            {
              [cn("w-fit", "translate-y-0 opacity-100")]: isHovering,
            },
          )}
        >
          <span className={cn("text-sm", "font-semibold")}>
            {t("common.labels.read")}
          </span>
          <NewTab className={cn("size-[.5rem]", "stroke-current")} />
        </div>
      </div>
    </Link>
  );
}
