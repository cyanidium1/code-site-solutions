/**
 * Hardcoded glossary of technical terms surfaced via schema.org DefinedTerm.
 *
 * Used to give AI/search crawlers explicit definitions of terms we use across
 * industry and blog pages. Pages reference entries by key via
 * `glossaryTerms(["lcp", "isr"], locale)` and pass the result to
 * `definedTermNodes()` from `@/lib/shared/jsonld`.
 *
 * TODO(sanity-migration): move to a Sanity `glossaryTerm` schema so terms can
 * be authored from Studio and referenced by industry / blog docs without code
 * changes. Until then, add new terms here.
 */

import type { Locale } from "@/types/sanity";
import type { DefinedTerm } from "@/lib/shared/jsonld";

type GlossaryEntry = { uk: DefinedTerm; en: DefinedTerm };

export const GLOSSARY: Record<string, GlossaryEntry> = {
  lcp: {
    uk: {
      name: "LCP",
      description:
        "Largest Contentful Paint — метрика Core Web Vitals, що вимірює час завантаження найбільшого видимого елементу сторінки.",
    },
    en: {
      name: "LCP",
      description:
        "Largest Contentful Paint — a Core Web Vitals metric measuring the load time of the largest visible element on a page.",
    },
  },
  coreWebVitals: {
    uk: {
      name: "Core Web Vitals",
      description:
        "Набір метрик Google (LCP, INP, CLS), які оцінюють реальний користувацький досвід сторінки і впливають на ранжування в пошуку.",
    },
    en: {
      name: "Core Web Vitals",
      description:
        "Google's set of metrics (LCP, INP, CLS) that measure real user experience and feed into search ranking.",
    },
  },
  isr: {
    uk: {
      name: "ISR",
      description:
        "Incremental Static Regeneration — стратегія Next.js, яка тримає сторінки статично згенерованими, але оновлює їх за розкладом без повного ребілду.",
    },
    en: {
      name: "ISR",
      description:
        "Incremental Static Regeneration — a Next.js strategy that keeps pages statically generated while refreshing them on a schedule without a full rebuild.",
    },
  },
  ssr: {
    uk: {
      name: "SSR",
      description:
        "Server-Side Rendering — генерація HTML сторінки на сервері при кожному запиті, що дає актуальні дані і повноцінне індексування пошуковиками.",
    },
    en: {
      name: "SSR",
      description:
        "Server-Side Rendering — generating page HTML on the server for each request, ensuring fresh data and full search-engine indexability.",
    },
  },
  nextjs: {
    uk: {
      name: "Next.js",
      description:
        "Production-фреймворк на базі React для побудови швидких сайтів з SSR, ISR, App Router та оптимізованим завантаженням.",
    },
    en: {
      name: "Next.js",
      description:
        "A production React framework for building fast websites with SSR, ISR, the App Router, and optimized asset loading.",
    },
  },
  seo: {
    uk: {
      name: "SEO",
      description:
        "Search Engine Optimization — комплекс технічних і контентних практик, що піднімають сайт у органічній видачі Google і Bing.",
    },
    en: {
      name: "SEO",
      description:
        "Search Engine Optimization — a set of technical and content practices that improve a site's ranking in Google and Bing organic results.",
    },
  },
  cms: {
    uk: {
      name: "CMS",
      description:
        "Content Management System — система керування контентом, що дозволяє редагувати тексти, зображення і структуру сайту без участі розробника.",
    },
    en: {
      name: "CMS",
      description:
        "Content Management System — software that lets editors update site copy, images, and structure without developer involvement.",
    },
  },
  headlessCms: {
    uk: {
      name: "Headless CMS",
      description:
        "CMS, що віддає контент через API і не нав'язує власний шаблонний рушій — фронтенд будується окремо на будь-якому стеку.",
    },
    en: {
      name: "Headless CMS",
      description:
        "A CMS that exposes content via an API without dictating its own templating engine, leaving the frontend free to use any stack.",
    },
  },
  sanity: {
    uk: {
      name: "Sanity",
      description:
        "Headless CMS на базі GROQ і real-time API, який ми використовуємо як джерело контенту для портфоліо, блогу і галузевих сторінок.",
    },
    en: {
      name: "Sanity",
      description:
        "A headless CMS built on GROQ and a real-time API; we use it as the content source for portfolio, blog, and industry pages.",
    },
  },
  typescript: {
    uk: {
      name: "TypeScript",
      description:
        "Статично типізована надбудова над JavaScript, яка ловить помилки на етапі компіляції і робить кодову базу передбачуваною.",
    },
    en: {
      name: "TypeScript",
      description:
        "A statically-typed superset of JavaScript that catches errors at compile time and keeps the codebase predictable as it grows.",
    },
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;

export function glossaryTerms(
  keys: readonly GlossaryKey[],
  locale: Locale,
): DefinedTerm[] {
  const localeKey = locale === "en" ? "en" : "uk";
  return keys
    .map((k) => GLOSSARY[k]?.[localeKey])
    .filter((t): t is DefinedTerm => Boolean(t));
}
