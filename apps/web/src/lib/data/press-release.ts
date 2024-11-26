import type { PressRelease } from "@repo/api/cms/types";
import stripMarkdown from "remove-markdown";

export function getContent(data: PressRelease) {
  return (
    data.content.plain ||
    (data.content.markdown && stripMarkdown(data.content.markdown)) ||
    ""
  );
}
