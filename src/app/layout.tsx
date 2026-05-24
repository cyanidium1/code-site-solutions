import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { SITE_ORIGIN } from "@/constants/site";
import "./globals.css";
import "./keyframes.css";

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
    { path: "../../public/fonts/ActayWide-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/ActayWide-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-actay",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Code-Site.Art — сайт що приймає заявки 24/7. Запуск 4-10 тижнів",
  description:
    "Кастомні сайти для бізнесу: ми пишемо тексти, дизайнимо, кодимо, ставимо інтеграції. Через 4-10 тижнів ви отримуєте готовий сайт що починає приводити клієнтів сам.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: SITE_ORIGIN,
    languages: {
      uk: SITE_ORIGIN,
      en: `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title: "Code-Site.Art — сайт що приймає заявки 24/7. Запуск 4-10 тижнів",
    description:
      "Кастомні сайти для бізнесу: ми пишемо тексти, дизайнимо, кодимо, ставимо інтеграції. Через 4-10 тижнів ви отримуєте готовий сайт що починає приводити клієнтів сам.",
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_US"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const lang = pathname.startsWith("/en") ? "en" : "uk";
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
