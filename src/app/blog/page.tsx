import type { Metadata } from "next";
import { HpHeader } from "@/components/homepage";

export const metadata: Metadata = {
  title: "Блог — Code-Site.Art",
  description:
    "Майбутні публікації про запуск сайтів на Next.js, інтеграції та досвід студії.",
  alternates: { canonical: "/blog" },
  robots: { index: false, follow: false },
};

export default function BlogPage() {
  return (
    <>
      <HpHeader />
      <main>
        <section className="hp-section" style={{ paddingTop: 120, minHeight: "50vh" }}>
          <div className="hp-inner">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ БЛОГ</span>
            </div>
            <h1 className="hp-h2" style={{ marginBottom: 16 }}>
              Скоро
            </h1>
            <p className="hp-sub">
              Готуємо матеріали про запуск сайтів, стек і процес роботи студії.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
