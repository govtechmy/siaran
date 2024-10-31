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

  function isHighPriority(pressRelease: PressRelease) {
    return pressRelease.priority === "high";
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
              "lg:col-start-1 lg:col-end-2",
            )}
          />
          <ViewAgency
            acronym={pressRelease.relatedAgency.acronym}
            className={cn(
              "row-start-1 row-end-2",
              "col-start-1 col-end-2",
              "lg:row-span-full",
              "lg:col-start-2 lg:col-end-3",
            )}
          />
          {isHighPriority(pressRelease) && (
            <UrgentTag
              className={cn(
                "row-start-1 row-end-2",
                "col-start-4 col-end-6",
                "lg:row-start-1 lg:row-end-2",
                "lg:col-start-3 lg:col-end-4",
                "ml-[.5rem] lg:ml-0",
                "lg:mr-[.5rem]",
              )}
            />
          )}
          <ViewTitle
            title={pressRelease.title}
            classNames={{
              container: cn(
                "row-start-2 row-end-3",
                "col-start-1",
                hasAttachment(pressRelease) ? "col-end-5" : "col-span-full",
                "lg:row-start-1 lg:row-end-2",
                "lg:col-start-4 lg:col-end-5",
              ),
            }}
          />
          <ViewContent
            content={pressRelease.content.plain}
            classNames={{
              container: cn(
                "hidden lg:block",
                "lg:row-start-2 lg:row-end-3",
                "lg:col-start-3 lg:col-end-5",
              ),
            }}
          />
          <ViewAttachment
            count={pressRelease.attachments?.length ?? 0}
            className={cn(
              "row-start-2 row-end-3",
              "col-start-5 col-end-6",
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
              "row-start-1 row-end-2",
              "col-start-2 col-end-3",
              "mx-[.375rem]",
            )}
          />
          <ViewDate
            date={pressRelease.date_published}
            classNames={{
              container: cn(
                "row-start-1 row-end-2",
                "col-start-3",
                {
                  "col-end-4": isHighPriority(pressRelease),
                  "col-end-6": !isHighPriority(pressRelease),
                },
                "lg:row-span-full",
                "lg:col-start-6 lg:col-end-7",
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
  const formattedTime = format(parseISO(date), "h:mm a");
  const time = parseISO(date);
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
          "lg:ml-[1.125rem]",
          "flex-1",
          "flex flex-row lg:flex-col lg:items-end",
          "text-sm text-gray-dim-500",
          "font-normal",
          "max-md:line-clamp-1",
          classNames?.date,
        )}
      >
        <span>
          {formattedDate}
          {!isStartOfDay && <span className={cn("mr-[.5ch] lg:mr-0")}>,</span>}
        </span>
        {!isStartOfDay && <span>{formattedTime}</span>}
      </div>
    </div>
  );
}
