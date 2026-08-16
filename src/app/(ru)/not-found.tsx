import Link from "next/link";

// 404 for the Russian route group. Rendered inside the (ru) root layout,
// so no <html>/<body> here. Unmatched /ru/* URLs reach this via the
// (ru)/ru/[...not-found] catch-all.
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[120px] leading-none font-bold bg-brand-gradient bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-2xl font-bold">Страница не найдена</h1>
      <p className="text-ink-dim max-w-md">
        Похоже, такой страницы нет или её перенесли.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/ru"
          className="rounded-full bg-brand-gradient px-6 py-3 font-medium text-white"
        >
          На главную
        </Link>
        <Link
          href="/ru/portfolio"
          className="rounded-full border border-line px-6 py-3 font-medium text-ink-dim"
        >
          Кейсы
        </Link>
      </div>
    </main>
  );
}
