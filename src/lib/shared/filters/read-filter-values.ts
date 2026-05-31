/**
 * Reads a Next.js `searchParams` prop (or URLSearchParams) into a
 * `{ key: value }` map for a fixed set of whitelisted keys. Unknown keys
 * are ignored. Array values (e.g. `?industry=a&industry=b`) take the first
 * entry — multi-select is out of scope.
 *
 * Generic over the key tuple so the return type stays tight, e.g.
 *   readFilterValues(params, ["industry", "country"] as const)
 *     // => { industry?: string; country?: string }
 */
export type SearchParamsLike =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

export function readFilterValues<K extends string>(
  searchParams: SearchParamsLike,
  keys: readonly K[],
): Partial<Record<K, string>> {
  const pick = (k: string): string | undefined => {
    if (!searchParams) return undefined;
    if (searchParams instanceof URLSearchParams) {
      const v = searchParams.get(k);
      return v ?? undefined;
    }
    const v = searchParams[k];
    if (Array.isArray(v)) return v[0];
    return v ?? undefined;
  };
  const out: Partial<Record<K, string>> = {};
  for (const k of keys) {
    const v = pick(k);
    if (v) out[k] = v;
  }
  return out;
}
