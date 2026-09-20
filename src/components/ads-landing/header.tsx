import { Phone, Send } from "lucide-react";

import LogoSVG from "@/components/layout/logo/logo-svg";
import { SITE_CONTACT } from "@/constants/site";
import type { AdsLandingContent } from "./types";

/**
 * Ads-landing header (TZ v2 §4): logo + phone + Telegram, no menu and no
 * links to other pages. The logo is deliberately not a link — a paid click
 * should stay on the offer. Phone/Telegram taps are tracked site-wide as
 * `contact_click` by PageViewTracker.
 */
export function AdsLandingHeader({ content }: { content: AdsLandingContent["header"] }) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8 xl:px-12">
      <div className="glass-ring mx-auto flex h-14 max-w-container items-center justify-between gap-3 rounded-full bg-[oklch(from_var(--color-bg)_l_c_h/0.72)] px-4 backdrop-blur-[12px] xl:px-5">
        <span className="inline-flex shrink-0 items-center text-ink" aria-label="Code-Site.Art">
          <LogoSVG variant="blue" animated={false} />
        </span>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE_CONTACT.phoneRaw}`}
            aria-label={`${content.phoneAria} ${SITE_CONTACT.phoneDisplay}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-sans text-[14px] font-medium text-ink no-underline transition-colors hover:text-accent-soft"
          >
            <Phone size={16} strokeWidth={1.8} aria-hidden />
            <span className="hidden sm:inline">{SITE_CONTACT.phoneDisplay}</span>
          </a>
          <a
            href={SITE_CONTACT.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 font-sans text-[14px] font-medium text-ink no-underline transition-colors hover:border-accent"
          >
            <Send size={15} strokeWidth={1.8} aria-hidden />
            {content.telegramLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Minimal footer: the contract is the only outbound link on the page. */
export function AdsLandingFooter({ content }: { content: AdsLandingContent["footer"] }) {
  return (
    <footer className="border-t border-line bg-bg px-6 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-4 font-sans text-[13px] text-ink-3">
        <span>
          © {new Date().getFullYear()} {content.rights}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <a href={`mailto:${SITE_CONTACT.email}`} className="text-ink-3 no-underline hover:text-ink">
            {SITE_CONTACT.email}
          </a>
          <a href={content.contractHref} className="text-ink-dim underline underline-offset-4 hover:text-ink">
            {content.contract}
          </a>
        </div>
      </div>
    </footer>
  );
}
