import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import "../globals.css";
import "../proposal.css";

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

const actay = localFont({
  src: [{ path: "../../../public/fonts/ActayWide-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-actay",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

/**
 * Root layout для комерційних пропозицій (/offer/*).
 *
 * Свідомо НЕ містить того, що є в мовних групах: next-intl, реєстр
 * контенту, GTM, банер мови, лічильник кейсів. КП — приватна сторінка для
 * однієї людини: аналітику на неї вішати не треба, а мова береться з
 * документа, а не з URL.
 *
 * `<html lang>` стоїть українською як запасний варіант і перекривається
 * атрибутом `lang` на контейнері сторінки — так само, як і має бути, коли
 * мова відома лише після завантаження документа.
 */
export default function OfferRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
