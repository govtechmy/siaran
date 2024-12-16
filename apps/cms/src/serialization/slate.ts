// using older versions of these packages to circumvent ESM module import restriction
import unified from "unified";
import remarkParse = require("remark-parse");
import remarkStringify from "remark-stringify";
import stripMarkdown = require("strip-markdown");
import remarkSlate = require("remark-slate");

type Node = {
  type:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "blockquote"
    | "ol"
    | "ul"
    | "li"
    | "link";
  text?: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  strikethrough?: boolean;
  url?: string;
  children?: Node[];
};

const converterPlainText = unified()
  .use(remarkParse)
  .use(stripMarkdown)
  .use(remarkStringify);

const converterSlate = unified().use(remarkParse).use(remarkSlate.default);

function strip(markdown: string) {
  return converterPlainText.processSync(markdown).contents;
}

function deserialize(markdown: string) {
  return converterSlate.processSync(markdown).result;
}

function getIndentation(depth: number) {
  return `    `.repeat(depth);
}

/**
 * Convert Slate syntax tree to markdown string
 * @param node
 * @param param1
 * @returns
 */
function serialize(
  node: Node,
  {
    depth = 0,
    listItemMarker = "",
  }: {
    depth?: number;
    listItemMarker?: string;
  },
) {
  if (node.text != null) {
    let string = node.text;

    if (node.bold) {
      string = `**${string}**`;
    }

    if (node.italic) {
      string = `*${string}*`;
    }

    if (node.code) {
      string = `\`${string}\``;
    }

    if (node.strikethrough) {
      string = `~${string}~`;
    }

    return `${string}`;
  }

  const { children, type } = node;

  switch (type) {
    case "h1":
      return `# ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "h2":
      return `## ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "h3":
      return `### ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "h4":
      return `#### ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "h5":
      return `##### ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "h6":
      return `###### ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "blockquote":
      return `${children.map((child) => `> ${serialize(child, { depth })}`).join("")}\n`;
    case "ol":
      return `${children
        .map((child, index) =>
          serialize(child, {
            depth: depth + 1,
            listItemMarker: `${index + 1}.`,
          }),
        )
        .join("")}\n`;
    case "ul":
      return `${children
        .map((child) =>
          serialize(child, {
            depth: depth + 1,
            listItemMarker: "*",
          }),
        )
        .join("")}\n`;
    case "li":
      return `${getIndentation(depth - 1)}${listItemMarker} ${children.map((child) => serialize(child, { depth })).join("")}\n`;
    case "link":
      return `[${children.map((child) => serialize(child, { depth }))}](${node.url})`;
    default:
      return `${children.map((child) => serialize(child, { depth })).join("")}\n`;
  }
}

export {
  strip as convertMarkdownToPlainText,
  deserialize as convertMarkdownToSlate,
  serialize as convertSlateToMarkdown,
};
