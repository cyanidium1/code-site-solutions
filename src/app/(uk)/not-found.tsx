import Link from "next/link";

// 404 for the Ukrainian (default-locale) route group. Rendered inside the
// (uk) root layout, so no <html>/<body> here. Unmatched root-level URLs
// reach this via the (uk)/[...not-found] catch-all; pages that call
// notFound() inside the group bubble here too.
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[120px] leading-none font-bold bg-brand-gradient bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-2xl font-bold">Сторінку не знайдено</h1>
      <p className="text-ink-dim max-w-md">
        Схоже, такої сторінки немає або її перенесли.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-brand-gradient px-6 py-3 font-medium text-white"
        >
          На головну
        </Link>
        <Link
          href="/portfolio"
          className="rounded-full border border-line px-6 py-3 font-medium text-ink-dim"
        >
          Кейси
        </Link>
      </div>
    </main>
  );
}
