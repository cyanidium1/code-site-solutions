import Link from "next/link";
import "./globals.css";

// Global 404 for unmatched URLs. Lives above the (uk)/(en) route-group
// layouts, so it must render its own <html>/<body>. Pages that call
// notFound() inside a group bubble here too. Returns a proper 404 status.
export default function NotFound() {
  return (
    <html lang="uk">
      <body className="bg-bg text-ink antialiased">
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-mono text-[120px] leading-none font-bold bg-brand-gradient bg-clip-text text-transparent">
            404
          </p>
          <h1 className="text-2xl font-bold">Сторінку не знайдено</h1>
          <p className="text-ink-dim max-w-md">
            Схоже, такої сторінки немає або її перенесли. Page not found.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-brand-gradient px-6 py-3 font-medium text-white"
            >
              На головну
            </Link>
            <Link
              href="/en"
              className="rounded-full border border-line px-6 py-3 font-medium text-ink-dim"
            >
              Home (EN)
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
