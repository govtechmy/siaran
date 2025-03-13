import type { I18nConfig } from "fumadocs-core/i18n";

export const i18n: I18nConfig = {
  defaultLanguage: "ms-MY",
  languages: ["ms-MY", "en-MY"],
};

export type Locale = "ms-MY" | "en-MY";

const STRINGS: Record<Locale, Record<string, string>> = {
  "ms-MY": {
    noResults: "Tiada keputusan dijumpai",
  },
  "en-MY": {
    noResults: "No results found",
  },
};

export function getString(key: string, lang: Locale) {
  return STRINGS[lang][key];
}
