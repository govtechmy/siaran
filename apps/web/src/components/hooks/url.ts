import { useAppLocale } from "@/i18n/routing";
import path from "path";

type Route = "index" | "press-releases";

export function useLocaleURL() {
  const locale = useAppLocale();

  return {
    url(route: Route, ...components: string[]) {
      const root = path.join("/", locale);

      if (route === "index") {
        return root;
      }

      return path.join(root, route, ...components);
    },
  };
}
