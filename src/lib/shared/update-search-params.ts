/**
 * Returns a new query-string built from an existing URLSearchParams (or
 * read-only ReadonlyURLSearchParams from next/navigation) with one or more
 * keys replaced. Setting a value to `null`, `undefined`, or "" removes the key.
 *
 * Pure — does not mutate the input. The returned string is suitable for
 * passing to router.push/replace as the search portion of a URL (no leading
 * "?"; caller adds one if non-empty).
 */
export function updateSearchParams(
  current:
    | URLSearchParams
    | { get(key: string): string | null; toString(): string }
    | null,
  updates: Record<string, string | null | undefined>,
): string {
  const next = new URLSearchParams(current?.toString() ?? "");
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  // Sort keys for stable URLs (avoids "industry=x&country=y" vs reversed
  // creating two cache entries).
  next.sort();
  return next.toString();
}

/**
 * Convenience: build a path + ?query string ready for router.replace.
 * Returns just the pathname when there are no params.
 */
export function buildHrefWithParams(
  pathname: string,
  params: Record<string, string | null | undefined>,
): string {
  const qs = updateSearchParams(null, params);
  return qs ? `${pathname}?${qs}` : pathname;
}
