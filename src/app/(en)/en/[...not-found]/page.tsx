import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Catch-all for unmatched /en/* URLs — renders the (en) group's 404.
export default function CatchAllNotFound() {
  notFound();
}

// SEO audit Aug 2026: without this the 404 inherited the locale
// layout's homepage title and its canonical pointing at "/". The 404
// status already keeps it out of the index; this stops the page from
// describing itself as the homepage to crawlers and to users.
export const metadata: Metadata = {
  title: "Page not found — 404 | Code-Site.Art",
  description: "This page does not exist or has moved. Use the navigation or head back to the homepage.",
  robots: { index: false, follow: true },
  alternates: {},
};
