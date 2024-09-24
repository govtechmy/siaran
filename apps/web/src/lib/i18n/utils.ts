import { AbstractIntlMessages } from "next-intl";

export function extract(messages: AbstractIntlMessages, path: string): string {
  const keys = path.split(".");

  let current = messages;

  for (const key of keys) {
    const value = current[key];

    if (typeof value === "string") {
      return value;
    }

    current = value;
  }

  return "";
}
