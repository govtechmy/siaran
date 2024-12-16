"use client";

import ReadingTime from "@/components/ReadingTime";
import Separator from "@/components/Separator";
import { getContent } from "@/lib/data/press-release";
import { cn } from "@/lib/ui/utils";
import type { PressRelease } from "@repo/api/cms/types";
import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { dataAtom } from "../stores/press-release";

export default function Content() {
  const [data] = useAtom(dataAtom);

  if (!data) {
    return null;
  }

  return <Data initialData={data} />;
}

function Data({ initialData }: { initialData: PressRelease }) {
  return (
    <div
      className={cn(
        "mx-auto",
        "w-[20.8125rem] max-w-full md:w-[40rem]",
        "flex flex-col items-stretch",
      )}
    >
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
          "text-sm text-black-500",
          "font-normal",
        )}
      >
        <ReadingTime text={getContent(initialData)} />
        <Separator type="bullet" className={cn("mx-[.5rem]")} />
        {format(parseISO(initialData.date_published), "d MMM yyyy h:mm a")}
      </div>
      <div
        className={cn(
          "mb-[3.75rem] mt-[1.5rem]",
          "flex flex-col items-start",
          "text-[1rem] leading-[1.75rem] text-black-700",
          "font-body font-normal",
          "[&_*]:w-full",
        )}
      >
        {initialData.content.markdown ? (
          <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={Components}
          >
            {initialData.content.markdown}
          </Markdown>
        ) : (
          initialData.content.plain
        )}
      </div>
    </div>
  );
}

const Components: ComponentProps<typeof Markdown>["components"] = {
  h1: ({ node, ...props }) => (
    <h1 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  h2: ({ node, ...props }) => (
    <h2 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  h3: ({ node, ...props }) => (
    <h3 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  h4: ({ node, ...props }) => (
    <h4 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  h5: ({ node, ...props }) => (
    <h5 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  h6: ({ node, ...props }) => (
    <h6 {...props} className={cn("mt-[.75rem]", "font-body font-semibold")} />
  ),
  table: ({ node, ...props }) => (
    <table
      {...props}
      className="min-w-full border-collapse border border-gray-outline-200"
    />
  ),
  tbody: ({ node, ...props }) => (
    <tbody {...props} className="divide-y divide-gray-outline-200" />
  ),
  th: ({ node, ...props }) => (
    <th
      {...props}
      className={cn(
        "px-[1rem] py-[.5rem]",
        "border border-gray-outline-200",
        "text-start",
      )}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      {...props}
      className={cn(
        "px-[1rem] py-[.5rem]",
        "border border-gray-outline-200",
        "text-start",
      )}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "my-[1.5rem]",
        "border-l-[.25rem] border-gray-outline-200",
        "px-[1rem]",
      )}
    />
  ),
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(props.className, "text-brand-600")}
    />
  ),
  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className={cn(
        "[&:not(:first-child)]:mt-[1.5rem]",
        "[&:not(:last-child)]:mb-[1.5rem]",
        "pl-8",
        "list-decimal space-y-2",
      )}
    >
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul
      {...props}
      className={cn(
        "[&:not(:first-child)]:mt-[1.5rem]",
        "[&:not(:last-child)]:mb-[1.5rem]",
        "list-disc space-y-2 pl-8",
      )}
    >
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className={cn("pl-2")}>
      {children}
    </li>
  ),
  p: ({ children, ...props }) => (
    <p
      {...props}
      className={cn(
        "[&:not(:first-child)]:mt-[1.5rem]",
        "[&:not(:last-child)]:mb-[1.5rem]",
        "text-justify",
      )}
    >
      {children}
    </p>
  ),
};
