"use client";

import ReadingTime from "@/components/ReadingTime";
import Separator from "@/components/Separator";
import { cn } from "@/lib/ui/utils";
import type { PressRelease } from "@repo/api/cms/types";
import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
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

type MarkdownItem = {
  type: "process" | "ignore" | "chunk";
  content: string;
};

function createChunk(content: string) {
  return {
    type: "chunk",
    content,
  } as MarkdownItem;
}

function chunkMarkdown(markdown: string): string {
  const replaced = markdown
    .replaceAll("\n\n\n", "\n\n")
    // Replace all '\n' with '\n\n'
    .replaceAll(/(?<!\n)\n(?!\n)/g, "\n\n");

  // Split the markdown and label each pre-processed markdown
  const split = replaced.split("\n\n").map((item) => ({
    type: item.startsWith("**") || item.startsWith("#") ? "ignore" : "process",
    content: item.trim(),
    length: item.trim().length,
  })) satisfies MarkdownItem[];

  // Chunk all short paragraphs into a single paragraph
  const chunked = split.reduce<MarkdownItem[]>((acc, current) => {
    if (acc.length === 0) {
      return [current];
    }

    if (current.type === "process") {
      const prevIndex = acc.length - 1;
      const prev = acc[prevIndex];

      if (prev.type === "chunk") {
        // Combine with the previous chunk
        const chunked = createChunk(prev.content + "  \n" + current.content);

        if (prevIndex === 0) {
          return [chunked];
        }

        return [...acc.slice(0, prevIndex), chunked];
      }

      return [
        ...acc,
        // Start a new chunk with current content
        createChunk(current.content),
      ];
    }

    return [...acc, current];
  }, []);

  console.log(chunked);

  // re-combine all chunks
  return chunked.map((item) => item.content).join("  \n\n");
}

function processMarkdown(markdown: string): string {
  return chunkMarkdown(markdown);
}

function Data({ initialData }: { initialData: PressRelease }) {
  function getContentArray(content: string) {
    const result = content
      // Match the start and the end of table markdown
      .split(/(\|(?:.*\|[\r\n]*)+)/g)
      .map((item) => (item.startsWith("|") ? item : processMarkdown(item)));

    return result;
  }

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
          "mt-[.75rem] [&_h1]:font-semibold",
          "mt-[.75rem] [&_h2]:font-semibold",
          "mt-[.75rem] [&_h3]:font-semibold",
          "mt-[.75rem] [&_h4]:font-semibold",
          "mt-[.75rem] [&_h5]:font-semibold",
          "mt-[.75rem] [&_h6]:font-semibold",
        )}
      >
        {/* {JSON.stringify(initialData.content.markdown)} */}
        {initialData.content.markdown
          ? getContentArray(initialData.content.markdown).map(
              (content, index) => (
                <Markdown
                  key={index}
                  className={cn("mt-[1.125rem]")}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className={cn("font-body")} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className={cn("font-body")} {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className={cn("font-body")} {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className={cn("font-body")} {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5 className={cn("font-body")} {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6 className={cn("font-body")} {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <table
                        className="min-w-full border-collapse border border-gray-outline-200"
                        {...props}
                      />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody
                        className="divide-y divide-gray-outline-200"
                        {...props}
                      />
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
                      <ol
                        className={cn(
                          "mt-[1.5rem]",
                          "list-decimal space-y-2 pl-8",
                        )}
                        {...props}
                      >
                        {children}
                      </ol>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul
                        className={cn(
                          "mt-[1.5rem]",
                          "list-disc space-y-2 pl-8",
                        )}
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }) => (
                      <li className={cn("pl-2")} {...props}>
                        {children}
                      </li>
                    ),
                    p: ({ children, ...props }) => (
                      <p
                        className={cn("mt-[1.5rem]", "text-justify")}
                        {...props}
                      >
                        {children}
                      </p>
                    ),
                  }}
                >
                  {content}
                </Markdown>
              ),
            )
          : initialData.content.plain}
      </div>
    </div>
  );
}
