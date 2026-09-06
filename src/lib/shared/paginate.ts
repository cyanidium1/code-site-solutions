import type { Metadata } from "next";

/**
 * Listing pagination helpers, shared by the three /blog pages.
 *
 * The blog listing used to render every post on one page: 70 cards, 29 467px
 * on a 390px viewport (35 screens) and 40 354px at 768 — design audit
 * 2026-09-06, finding C5. These helpers cut it into pages of `PAGE_SIZE`
 * while keeping the page a server component: the page number is a URL param,
 * so every page is a real, crawlable URL.
 */

/** Posts per listing page. One featured card + 11 grid cards on page 1. */
export const BLOG_PAGE_SIZE = 12;

/** Clamps a raw `?page=` value to an existing page number. */
export function readPageParam(
  raw: string | undefined,
  totalPages: number,
): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, Math.max(1, totalPages));
}

export type PageSlice<T> = {
  /** Items on the current page. */
  items: T[];
  /** 1-based current page, already clamped to the available range. */
  page: number;
  totalPages: number;
};

export function paginate<T>(
  all: readonly T[],
  rawPage: string | undefined,
  pageSize = BLOG_PAGE_SIZE,
): PageSlice<T> {
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const page = readPageParam(rawPage, totalPages);
  const start = (page - 1) * pageSize;
  return { items: all.slice(start, start + pageSize), page, totalPages };
}

/**
 * Builds a listing href that carries the current category filter and the
 * page number, dropping `page=1` so the first page keeps its clean URL.
 */
export function listingHref(
  basePath: string,
  page: number,
  category?: string,
): string {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

/**
 * Page-2-and-beyond metadata: a self-referencing canonical so the paginated
 * URL is indexable in its own right, a numbered title so it is not a
 * duplicate of page 1, and NO hreflang — each locale's blog holds a
 * different number of posts, so "page 2" in UA is not the translation of
 * "page 2" in EN.
 */
export function paginatedMetadata(
  base: Metadata,
  opts: { path: string; page: number; suffix: (page: number) => string },
): Metadata {
  if (opts.page <= 1) return base;
  const title =
    typeof base.title === "string" ? `${base.title}${opts.suffix(opts.page)}` : base.title;
  return {
    ...base,
    title,
    alternates: { canonical: `${opts.path}?page=${opts.page}` },
    openGraph: base.openGraph
      ? { ...base.openGraph, title: typeof title === "string" ? title : undefined }
      : undefined,
    robots: { index: true, follow: true },
  };
}
