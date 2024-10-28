import Clipper from "@/components/icons/clipper";
import PressReleaseTag from "@/components/PressReleaseTag";
import Separator from "@/components/Separator";
import UrgentTag from "@/components/UrgentTag";
import { cn } from "@/lib/ui/utils";
import type { PressRelease, PressReleaseType } from "@repo/api/cms/types";
import { format, parseISO } from "date-fns";

type Props = {
  data: PressRelease[];
};

export default function PressReleaseListView({ data }: Props) {
  function hasAttachment(pressRelease: PressRelease) {
    return pressRelease.attachments && pressRelease.attachments.length > 0;
  }

  return (
    <div className={cn("w-full")}>
      {data.map((pressRelease, index) => (
        <div
          key={index}
          className={cn(
            "w-full",
            "gap-y-[.25rem]",
            "px-[1.125rem] py-[.75rem]",
            "border-x border-b border-gray-outline-200 first:border-t",
            "first:rounded-t-[.75rem] last:rounded-b-[.75rem]",
            "grid",
            "lg:grid-cols-[8.75rem_5.625rem_auto_1fr_auto_auto]",
            "grid-cols-[auto_auto_1fr_auto_auto]",
            "grid-rows-2 grid-rows-[auto_auto]",
            "cursor-pointer",
          )}
        >
          <ViewType
            type={pressRelease.type}
            className={cn(
              "hidden lg:block",
              "lg:row-span-full",
              "lg:col-span-1 lg:col-start-1",
            )}
          />
          <ViewAgency
            acronym={pressRelease.relatedAgency.acronym}
            className={cn(
              "row-span-1 row-start-1",
              "col-span-1 col-start-1",
              "lg:row-span-full",
              "lg:col-span-1 lg:col-start-2",
            )}
          />
          {pressRelease.priority === "high" && (
            <UrgentTag
              className={cn(
                "row-span-1 row-start-1",
                "col-span-2 col-start-4",
                "lg:row-span-1 lg:row-start-1",
                "lg:col-span-1 lg:col-start-3",
                "ml-[.5rem] lg:ml-0",
                "lg:mr-[.5rem]",
              )}
            />
          )}
          <ViewTitle
            title={pressRelease.title}
            classNames={{
              container: cn(
                "row-span-1 row-start-2",
                "col-start-1",
                hasAttachment(pressRelease) ? "col-span-4" : "col-span-full",
                "lg:row-span-1 lg:row-start-1",
                "lg:col-span-1 lg:col-start-4",
              ),
            }}
          />
          <ViewContent
            content={pressRelease.content.plain}
            classNames={{
              container: cn(
                "hidden lg:block",
                "lg:row-span-1 lg:row-start-2",
                "lg:col-span-2 lg:col-start-3",
              ),
            }}
          />
          <ViewAttachment
            count={pressRelease.attachments?.length ?? 0}
            className={cn(
              "row-span-1 row-start-2",
              "col-span-1 col-start-5",
              "lg:row-span-full",
              "lg:col-start-5",
              "flex flex-row",
              "items-center justify-end lg:justify-center",
              "ml-[.5rem] lg:ml-0",
              "lg:ml-[1.125rem]",
            )}
          />
          <Separator
            type="bullet"
            className={cn(
              "lg:hidden",
              "row-span-1 row-start-1",
              "col-span-1 col-start-2",
              "mx-[.375rem]",
            )}
          />
          <ViewDate
            date={pressRelease.date_published}
            classNames={{
              container: cn(
                "row-span-1 row-start-1",
                "col-span-1 col-start-3",
                "lg:row-span-full",
                "lg:col-start-6",
                "lg:ml-[1.125rem]",
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ViewType({
  type,
  className,
}: {
  type: PressReleaseType;
  className?: string;
}) {
  return (
    <div className={cn("hidden lg:block", "place-content-center", className)}>
      <PressReleaseTag
        type={type}
        className={cn("flex flex-row items-center justify-center")}
      />
    </div>
  );
}

function ViewAgency({
  acronym,
  className,
}: {
  acronym: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center",
        "text-sm lg:text-base",
        "text-gray-dim-500",
        "font-medium",
        className,
      )}
    >
      {acronym}
    </div>
  );
}

function ViewTitle({
  title,
  classNames,
}: {
  title: string;
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
  };
}) {
  return (
    <div className={cn("flex flex-row items-center", classNames?.container)}>
      <p
        className={cn(
          "w-fit",
          "text-black-900",
          "font-semibold",
          "line-clamp-2 lg:line-clamp-1",
          "truncate text-wrap",
          "break-words lg:break-all",
          classNames?.title,
        )}
      >
        {title}
      </p>
    </div>
  );
}

function ViewContent({
  content,
  classNames,
}: {
  content?: string;
  classNames?: {
    container?: string;
    content?: string;
  };
}) {
  return (
    <div
      className={cn(
        "flex-rows flex items-center justify-center",
        classNames?.container,
      )}
    >
      <p
        className={cn(
          "text-sm",
          "text-black-700",
          "line-clamp-1 truncate text-wrap break-all",
          classNames?.content,
        )}
      >
        {content}
      </p>
    </div>
  );
}

function ViewAttachment({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count === 0) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "size-fit",
          "rounded-[.375rem]",
          "border border-gray-outline-200",
          "flex flex-row items-center gap-x-[.125rem]",
          "py-[.125rem] pl-[.25rem] pr-[.375rem]",
        )}
      >
        <Clipper className={cn("stroke-current", "text-black-900")} />
        <span className={cn("text-xs text-black-700", "font-medium")}>
          {count}
        </span>
      </div>
    </div>
  );
}

function ViewDate({
  date,
  classNames,
}: {
  date?: string;
  className?: string;
  classNames?: {
    container?: string;
    date?: string;
  };
}) {
  if (!date) {
    return null;
  }

  const formattedDate = format(parseISO(date), "d MMM yyyy");
  const time = parseISO(date);
  const formatttedTime = format(time, "h:mm a");
  const isStartOfDay = time.getHours() === 0 && time.getMinutes() === 0;

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center",
        classNames?.container,
      )}
    >
      <div
        className={cn(
          "w-fit",
          "flex lg:flex-col lg:items-end",
          "text-sm text-gray-dim-500",
          "font-normal",
          classNames?.date,
        )}
      >
        <span>
          {formattedDate}
          {!isStartOfDay && <span className={cn("mr-[.5ch] lg:mr-0")}>,</span>}
        </span>
        {!isStartOfDay && <span>{formatttedTime}</span>}
      </div>
    </div>
  );
}
