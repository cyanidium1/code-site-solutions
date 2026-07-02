import { COOKIEYES_ID } from "@/constants/site";

/**
 * CookieYes consent banner + Google Consent Mode v2 bootstrap (free tier).
 *
 * One inline script, rendered ahead of {@link GoogleTagManager} in the root
 * layouts, does two things in a guaranteed order:
 *
 * 1. Pushes the GCM v2 **default = denied** state (CookieYes's documented
 *    custom-script snippet — their script does NOT set defaults itself; the
 *    dashboard "Check GCM status" reports "Default consent not set" without
 *    this). Defaults are global, not EU-scoped, matching the banner which
 *    also shows globally on the free tier.
 * 2. Injects the CookieYes CDN script, which renders the banner and pushes
 *    `consent update` when the visitor chooses. Choice persists in its own
 *    365-day `cookieyes-consent` cookie (flagged `secure` — so it won't stick
 *    on plain-HTTP local testing, only on HTTPS).
 *
 * Both must run before GTM boots so GA4/Pixel stay gated ("basic" consent
 * mode — "Allow Google tags to fire before consent" is OFF in the dashboard).
 *
 * A single inline body script beats `next/script`/plain `<script async>` here:
 * React 19 hoists async scripts into <head>, which could let the CDN script
 * execute before the defaults on a warm cache.
 *
 * The served script is domain-locked to `code-site.art` (suffix match, any
 * subdomain) — it silently no-ops on localhost and *.vercel.app. For local
 * testing use http://local.code-site.art:3000 (hosts-file alias).
 *
 * Renders nothing while {@link COOKIEYES_ID} is blank.
 */
export function CookieYes() {
  if (!COOKIEYES_ID) return null;
  return (
    <script
      id="cookieyes-gcm"
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:2000});
gtag("set","ads_data_redaction",true);
gtag("set","url_passthrough",true);
(function(d){var s=d.createElement("script");s.id="cookieyes";s.async=true;s.src="https://cdn-cookieyes.com/client_data/${COOKIEYES_ID}/script.js";d.head.appendChild(s);})(document);`,
      }}
    />
  );
}
