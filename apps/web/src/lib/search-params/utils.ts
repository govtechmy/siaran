export function mergeSearchParams(
  searchParams: string,
  records?: Record<string, string>,
) {
  const params = new URLSearchParams(searchParams);

  if (records) {
    for (const [key, value] of Object.entries(records)) {
      params.set(key, value);
    }
  }

  return params;
}

export function mergePathname(
  pathname: string,
  searchParams: URLSearchParams,
  records?: Record<string, string>,
) {
  return `${pathname}?${mergeSearchParams(searchParams.toString(), records)}`;
}
