import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Catch-all for unmatched /ru/* URLs — renders the (ru) group's 404.
export default function CatchAllNotFound() {
  notFound();
}

// SEO audit Aug 2026: without this the 404 inherited the locale
// layout's homepage title and its canonical pointing at "/". The 404
// status already keeps it out of the index; this stops the page from
// describing itself as the homepage to crawlers and to users.
export const metadata: Metadata = {
  title: "Страница не найдена — 404 | Code-Site.Art",
  description: "Такой страницы нет или она была перенесена. Воспользуйтесь навигацией или вернитесь на главную.",
  robots: { index: false, follow: true },
  alternates: {},
};
