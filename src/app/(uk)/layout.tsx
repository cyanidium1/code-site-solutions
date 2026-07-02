import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ukMessages from "../../../messages/uk.json";

import { Providers } from "../providers";
import { SITE_ORIGIN } from "@/constants/site";
import { getEnRegistrySafe, toWire } from "@/lib/server/i18n-registry";
import { fetchCaseStudyCount } from "@/lib/server/fetch-case-study-count";
import { CaseCountProvider } from "@/components/layout/case-count-provider";
import { I18nRegistryProvider } from "@/components/layout/i18n-registry-provider";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { CookieYes } from "@/components/analytics/cookie-yes";

import "../globals.css";
import "../keyframes.css";
import "../vendor.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const actay = localFont({
  src: [
    { path: "../../../public/fonts/ActayWide-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../../public/fonts/ActayWide-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-actay",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ᐈ Студія розробки кастомних сайтів під ключ | Code-Site.Art",
  description:
    "➤ Кастомні сайти під ключ для бізнесу та стартапів ✔️ Фікс-ціна від $1 000 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 тижнів ✔️ Гарантія 1 рік ➤ Замовте безкоштовний дзвінок.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: SITE_ORIGIN,
    languages: {
      uk: SITE_ORIGIN,
      "en-GB": `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title: "ᐈ Студія розробки кастомних сайтів під ключ | Code-Site.Art",
    description:
      "➤ Кастомні сайти під ключ для бізнесу та стартапів ✔️ Фікс-ціна від $1 000 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 тижнів ✔️ Гарантія 1 рік ➤ Замовте безкоштовний дзвінок.",
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_GB"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Студія розробки кастомних сайтів під ключ | Code-Site.Art",
    description:
      "➤ Кастомні сайти під ключ для бізнесу та стартапів ✔️ Фікс-ціна від $1 000 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 тижнів ✔️ Гарантія 1 рік ➤ Замовте безкоштовний дзвінок.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121212",
};

/**
 * Root layout for the Ukrainian (default-locale) route group.
 *
 * `<html lang>` is hardcoded statically so this layout — and the routes
 * inside the (uk) group — render statically. That lets Next's CSS-inlining
 * (`experimental.inlineCss`) work, which removes the render-blocking CSS
 * <link> that was gating LCP.
 *
 * The English routes live under `app/(en)/en/*` and have their own root
 * layout with `lang="en"`.
 */
export default async function UkRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pin the request locale so next-intl's request config (`requestLocale`)
  // picks UA messages without needing a request-time header.
  setRequestLocale("uk");
  // Fetch once per layout render — `unstable_cache` shares the Sanity
  // round-trip across every page in the (uk) group within the revalidate
  // window. Wire-format keeps RSC serialization happy across versions.
  // Case count matches portfolio index (`CASE_STUDIES_QUERY`), both locales.
  const [i18nRegistry, caseCount] = await Promise.all([
    toWire(await getEnRegistrySafe()),
    fetchCaseStudyCount(),
  ]);
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased overflow-x-clip">
        <CookieYes />
        <GoogleTagManager />
        <NextIntlClientProvider locale="uk" messages={ukMessages}>
          <Providers>
            <I18nRegistryProvider value={i18nRegistry}>
              <CaseCountProvider count={caseCount}>{children}</CaseCountProvider>
            </I18nRegistryProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
