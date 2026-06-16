/**
 * Next.js statically prerenders the root route (`/`) with `usePathname()`
 * returning the literal `"/index"` instead of `"/"`. Named segments (e.g.
 * `/en`, `/pricing`) are unaffected — only the bare index page aliases this
 * way, and the value gets baked into the prerendered HTML on Vercel.
 *
 * That stray `"/index"` breaks any pathname-based logic on the homepage:
 *   - the locale switcher couldn't match its `"/"` special-case, so EN fell
 *     through to "no counterpart" and rendered disabled ("EN version coming
 *     soon") — you literally couldn't switch UA → EN on the homepage;
 *   - the header's active-nav highlight missed the Home link;
 *   - analytics logged page views as `/index`.
 *
 * Normalize the index alias (and nullish values) back to `"/"` at every
 * `usePathname()` read site so downstream logic sees the canonical root path.
 */
export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname || pathname === "/index") return "/";
  return pathname;
}
