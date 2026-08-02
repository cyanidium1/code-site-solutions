import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ruMessages from "../../../messages/ru.json";

import { Providers } from "../providers";
import { SITE_ORIGIN } from "@/constants/site";
import { LOCALE_CONFIG } from "@/constants/locales";
import { buildAlternates } from "@/lib/shared/alternates";
import { getContentRegistrySafe, toWire } from "@/lib/server/i18n-registry";
import { fetchCaseStudyCount } from "@/lib/server/fetch-case-study-count";
import { CaseCountProvider } from "@/components/layout/case-count-provider";
import { I18nRegistryProvider } from "@/components/layout/i18n-registry-provider";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { ConsentBootstrap } from "@/lib/cookie-consent";

import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

const actay = localFont({
  src: [
    { path: "../../../public/fonts/ActayWide-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-actay",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
  description:
    "➤ Кастомные сайты под ключ для бизнеса и стартапов ✔️ Фикс-цена от $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 недель ✔️ Гарантия 1 год ➤ Закажите бесплатный звонок.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: buildAlternates({ locale: "ru", uaPath: "/" }),
  openGraph: {
    title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
    description:
      "➤ Кастомные сайты под ключ для бизнеса и стартапов ✔️ Фикс-цена от $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 недель ✔️ Гарантия 1 год ➤ Закажите бесплатный звонок.",
    type: "website",
    locale: LOCALE_CONFIG.ru.ogLocale,
    url: `${SITE_ORIGIN}/ru`,
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
    description:
      "➤ Кастомные сайты под ключ для бизнеса и стартапов ✔️ Фикс-цена от $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 недель ✔️ Гарантия 1 год ➤ Закажите бесплатный звонок.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

/**
 * Root layout for the Russian route group. Routes live under
 * `app/(ru)/ru/*` so URLs stay `/ru/...`; the `(ru)` group disappears
 * from the URL but gives RU its own static `<html lang>` and rendering.
 *
 * See the (uk) layout for the rationale on static `<html lang>`.
 */
export default async function RuRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("ru");
  // Fetch once per layout render — `unstable_cache` shares the Sanity
  // round-trip across every page in the (ru) group within the revalidate
  // window. Wire-format keeps RSC serialization happy across versions.
  const [i18nRegistry, caseCount] = await Promise.all([
    toWire(await getContentRegistrySafe()),
    fetchCaseStudyCount(),
  ]);
  return (
    <html
      lang={LOCALE_CONFIG.ru.htmlLang}
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable} ${montserrat.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased overflow-x-clip">
        <ConsentBootstrap />
        <GoogleTagManager />
        <NextIntlClientProvider locale="ru" messages={ruMessages}>
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
