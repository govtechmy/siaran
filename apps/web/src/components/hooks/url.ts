import { useAppLocale } from "@/i18n/routing";
import path from "path";

type Route = "index" | "press-releases";

export function useLocaleURL() {
  const locale = useAppLocale();

  return {
    url(route: Route, ...components: string[]) {
      return path.join(locale, route, ...components);
    },
  };
}
