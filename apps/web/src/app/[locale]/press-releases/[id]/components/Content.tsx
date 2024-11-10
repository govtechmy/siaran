"use client";

import ReadingTime from "@/components/ReadingTime";
import Separator from "@/components/Separator";
import { cn } from "@/lib/ui/utils";
import type { PressRelease } from "@repo/api/cms/types";
import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import stripMarkdown from "remove-markdown";
import { dataAtom } from "../stores/press-release";

export default function Content() {
  const [data] = useAtom(dataAtom);

  if (!data) {
    return null;
  }

  return <Data initialData={data} />;
}

function splitCombineMarkdown(markdown: string): string {
  const split = markdown
    .replaceAll(/[“”]/g, '"')
    .split(/(?=(?:\n|^)\|)|(?<=\n\n)/g)
    .map((item) => {
      const pre = item.trim();

      if (pre.startsWith("|")) {
        return pre;
      }

      // Split into sentences.
      const split = pre.split(
        // Don't split strings like "Mr.", "Dr.", "1.", "2.", etc.
        /((?<![A-Z][a-z](?=\.))(?<!\d(?=\.))(?<=[\S])([.!?])(?=\s|\z))/g,
      );

      let quoting = false;

      return split.reduce((acc, item) => {
        const pre = item.trim();

        if (pre === ".") {
          // the end of a sentence
          return acc + pre;
        }

        // // add a quotation mark to the beginning of each quoted sentence
        const isQuotationStart = pre.startsWith('"');
        const isQuotationEnd = pre.indexOf('"') > 0;

        if (isQuotationStart && !quoting) {
          quoting = true;
        } else if (quoting && isQuotationEnd) {
          quoting = false;
        }

        const prefix =
          (quoting && !isQuotationStart) || isQuotationEnd ? '"' : "";

        return acc + "\n\n" + prefix + pre;
      }, "");
    })
    .flat()
    .map((item) => item.trim());

  const reduced = split.reduce((acc, item) => {
    if (item.startsWith("|")) {
      // add a newline character to re-create the row
      return acc + item + "\n";
    }

    return acc + item + "\n\n";
  }, "");

  return reduced;
}

function Data({ initialData }: { initialData: PressRelease }) {
  const chunked = splitCombineMarkdown(initialData.content.markdown);

  return (
    <div
      className={cn(
        "mx-auto",
        "w-[20.8125rem] md:w-[40rem]",
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
          "flex flex-col items-start",
          "text-[1rem] leading-[1.75rem] text-black-700",
          "font-body font-normal",
          "[&_*]:w-full",
        )}
      >
        {initialData.content.markdown ? (
          <Markdown
            className={cn("mt-[1.125rem]")}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={Components}
          >
            {chunked}
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
    <h1 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  h5: ({ node, ...props }) => (
    <h5 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  h6: ({ node, ...props }) => (
    <h6 className={cn("mt-[.75rem]", "font-body font-semibold")} {...props} />
  ),
  table: ({ node, ...props }) => (
    <table
      className="min-w-full border-collapse border border-gray-outline-200"
      {...props}
    />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-gray-outline-200" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th
      className={cn(
        "px-[1rem] py-[.5rem]",
        "border border-gray-outline-200",
        "text-start",
      )}
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className={cn(
        "px-[1rem] py-[.5rem]",
        "border border-gray-outline-200",
        "text-start",
      )}
      {...props}
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
    <ol className={cn("mt-[1.5rem]", "list-decimal space-y-2 pl-8")} {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className={cn("mt-[1.5rem]", "list-disc space-y-2 pl-8")} {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className={cn("pl-2")} {...props}>
      {children}
    </li>
  ),
  p: ({ children, ...props }) => (
    <p className={cn("my-[1.5rem]", "text-justify")} {...props}>
      {children}
    </p>
  ),
};
