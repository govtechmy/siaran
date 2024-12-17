export function mergeSearchParams(
  searchParams: string,
  records?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(searchParams);

  if (records) {
    for (const [key, value] of Object.entries(records)) {
      if (typeof value === "undefined") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
  }

  return params;
}

/**
 * Merge search params into a URL
 * @param pathname The pathname (e.g. /login) without query string
 * @param searchParams The current search params (if any)
 * @param records The parameters to merge
 * @returns
 */
export function mergePathname(
  pathname: string,
  searchParams: URLSearchParams,
  records?: Record<string, string | undefined>,
) {
  return `${pathname}?${mergeSearchParams(searchParams.toString(), records)}`;
}
