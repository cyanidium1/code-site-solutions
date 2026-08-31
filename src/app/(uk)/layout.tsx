import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ukMessages from "../../../messages/uk.json";

import { Providers } from "../providers";
import { OG_DEFAULT_IMAGE, SITE_ORIGIN } from "@/constants/site";
import { LOCALE_CONFIG, SECONDARY_LOCALES } from "@/constants/locales";
import { buildAlternates } from "@/lib/shared/alternates";
import { getContentRegistrySafe, toWire } from "@/lib/server/i18n-registry";
import { fetchCaseStudyCount } from "@/lib/server/fetch-case-study-count";
import { CaseCountProvider } from "@/components/layout/case-count-provider";
import { I18nRegistryProvider } from "@/components/layout/i18n-registry-provider";
import { LanguageBanner } from "@/components/layout/language-banner";
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
  title: "ᐈ Веб-студія Code-Site.Art — замовити сайт від $800",
  description:
    "➤ Веб-студія: замовити сайт під ключ для бізнесу ✔️ Фікс-ціна від $800 ✔️ Next.js + Sanity ✔️ Запуск за 1–8 тижнів ➤ Безкоштовний прорахунок за день.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: buildAlternates({ locale: "uk", uaPath: "/" }),
  openGraph: {
    title: "ᐈ Веб-студія Code-Site.Art — замовити сайт від $800",
    description:
      "➤ Веб-студія: замовити сайт під ключ для бізнесу ✔️ Фікс-ціна від $800 ✔️ Next.js + Sanity ✔️ Запуск за 1–8 тижнів ➤ Безкоштовний прорахунок за день.",
    type: "website",
    locale: LOCALE_CONFIG.uk.ogLocale,
    alternateLocale: SECONDARY_LOCALES.map((l) => LOCALE_CONFIG[l].ogLocale),
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Веб-студія Code-Site.Art — замовити сайт від $800",
    description:
      "➤ Веб-студія: замовити сайт під ключ для бізнесу ✔️ Фікс-ціна від $800 ✔️ Next.js + Sanity ✔️ Запуск за 1–8 тижнів ➤ Безкоштовний прорахунок за день.",
    images: [OG_DEFAULT_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
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
    toWire(await getContentRegistrySafe()),
    fetchCaseStudyCount(),
  ]);
  return (
    <html
      lang={LOCALE_CONFIG.uk.htmlLang}
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable} ${montserrat.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased overflow-x-clip">
        <ConsentBootstrap />
        <GoogleTagManager />
        <NextIntlClientProvider locale="uk" messages={ukMessages}>
          <Providers>
            <I18nRegistryProvider value={i18nRegistry}>
              {/* Client-rendered: keeps the server HTML identical for every
                  visitor so `/` stays CDN-cacheable without Vary. Replaces
                  the old Accept-Language redirect (see src/middleware.ts). */}
              <LanguageBanner />
              <CaseCountProvider count={caseCount}>{children}</CaseCountProvider>
            </I18nRegistryProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
