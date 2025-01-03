import { CMSLocale, Locale } from "#cms/types";

export function mapLocale(locale: Locale): CMSLocale {
  switch (locale) {
    case "en-MY":
      return "en";
    case "ms-MY":
      return "ms";
  }
}
