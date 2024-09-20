import { PressRelease } from "@/app/types/types";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import PressReleaseTag from "./PressReleaseTag";

type Props = {
  data: PressRelease;
};

export default function PressReleaseCard({ data }: Props) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "rounded-[0.75rem]",
        "border-gray-outline-200opacity-100 border",
        "flex flex-col gap-y-[0.5rem]",
        "p-[1.5rem]",
      )}
    >
      <PressReleaseTag type={data.type} />
      <div
        className={cn(
          "text-base font-semibold text-black-900",
          "line-clamp-1 lg:line-clamp-2",
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
        {data.content.plain}
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
        <div className="text-gray-outline-300">•</div>
        <div className={"text-gray-dim-500"}>
          {format(parseISO(data.date_published), "d MMM yyyy, H:mm a")}
        </div>
      </div>
    </div>
  );
}
