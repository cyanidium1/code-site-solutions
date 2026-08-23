import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Catch-all for unmatched root-level URLs. Calls notFound() so the (uk)
// group's not-found.tsx renders inside the (uk) root layout with a real
// 404 status. Static segments and dynamic routes always win over this
// catch-all, so real pages are unaffected.
export default function CatchAllNotFound() {
  notFound();
}

// SEO audit Aug 2026: without this the 404 inherited the locale
// layout's homepage title and its canonical pointing at "/". The 404
// status already keeps it out of the index; this stops the page from
// describing itself as the homepage to crawlers and to users.
export const metadata: Metadata = {
  title: "Сторінку не знайдено — 404 | Code-Site.Art",
  description: "Такої сторінки немає або її перенесли. Скористайтеся навігацією або поверніться на головну.",
  robots: { index: false, follow: true },
  alternates: {},
};
