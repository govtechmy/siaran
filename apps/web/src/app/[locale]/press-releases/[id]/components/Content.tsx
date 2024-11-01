"use client";

import ReadingTime from "@/components/ReadingTime";
import Separator from "@/components/Separator";
import { cn } from "@/lib/ui/utils";
import type { PressRelease } from "@repo/api/cms/types";
import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
import Markdown from "react-markdown";
import stripMarkdown from "remove-markdown";
import { dataAtom } from "../stores/press-release";

export default function Content() {
  const [data] = useAtom(dataAtom);

  if (!data) {
    return null;
  }

  return <Data initialData={data} />;
}

function Data({ initialData }: { initialData: PressRelease }) {
  function getContentArray(content: string) {
    return content.split("\n\n");
  }

  return (
    <div className={cn("mx-auto", "w-[40rem]", "flex flex-col items-stretch")}>
      <div
        className={cn(
          "mr-auto mt-[3rem]",
          "text-sm text-gray-dim-500",
          "font-medium",
        )}
      >
        {initialData.relatedAgency.name} ({initialData.relatedAgency.acronym})
      </div>
      <div
        className={cn(
          "mt-[.75rem]",
          "text-2xl text-black-900",
          "font-semibold",
          "uppercase",
        )}
      >
        {initialData.title}
      </div>
      <div
        className={cn(
          "mt-[.75rem]",
          "flex flex-row items-center justify-start",
          "text-black-500 text-sm",
          "font-normal",
        )}
      >
        <ReadingTime
          text={
            initialData.content.plain ||
            stripMarkdown(initialData.content.markdown)
          }
        />
        <Separator type="bullet" className={cn("mx-[.5rem]")} />
        {format(parseISO(initialData.date_published), "d MMM yyyy h:mm a")}
      </div>
      <div
        className={cn(
          "mb-[3.75rem] mt-[1.5rem]",
          "text-[.9375rem] leading-[1.6875rem] text-black-700",
          "flex flex-col items-start",
          "font-normal",
          "[&_hr]:hidden",
          "[&_*]:font-body",
          "[&_*]:text-justify",
          "[&_*]:w-full",
          "[&_h1]:font-heading [&_h1]:font-semibold",
          "[&_h2]:font-heading [&_h2]:font-semibold",
          "[&_h3]:font-heading [&_h3]:font-semibold",
          "[&_h4]:font-heading [&_h4]:font-semibold",
          "[&_h5]:font-heading [&_h5]:font-semibold",
          "[&_h6]:font-heading [&_h6]:font-semibold",
        )}
      >
        {initialData.content.markdown
          ? getContentArray(initialData.content.markdown).map(
              (content, index) => (
                <div key={index} className={cn("mt-[1.125rem]")}>
                  <Markdown>{content.trim()}</Markdown>
                </div>
              ),
            )
          : initialData.content.plain}
      </div>
    </div>
  );
}
