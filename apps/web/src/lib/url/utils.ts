import { Locale } from "@/i18n/routing";

type Route = "index" | "press-releases";

export function getLocalizedURL(
  locale: Locale,
  route: Route,
  ...components: string[]
) {
  const base = `/${locale}`;

  if (route === "index") {
    return base;
  }

  // add a leading slash for every URL component and then join all components
  // e.g. 'example' => '/example'
  const rest = `${components.map((component) => `/${component}`).join("")}`;

  return `${base}/${route}${rest}`;
}
