/**
 * Entry animations as a React-hoisted <style href precedence> tag — the
 * replacement for consent.module.css (removed 2026-07-09).
 *
 * Why not a CSS module: the consent components are reachable from the root
 * layouts (ConsentProvider), so their module CSS chunk became one of the
 * THREE render-blocking stylesheets on every page — 529 bytes paying
 * 450–490 ms of request latency on slow 4G (see
 * docs/render-blocking-css-report.md). A hoisted style is deduped by React,
 * SSR-inlined into <head> only when a consent surface renders, and costs no
 * network request. Layout/colors remain Tailwind classes in classes.ts.
 */

export const consentBannerInClass = "csb-consent-banner-in";
export const consentDialogInClass = "csb-consent-dialog-in";

const CONSENT_ENTRY_CSS = `
.csb-consent-banner-in{animation:csb-consent-slide-up .35s cubic-bezier(.22,1,.36,1) both}
.csb-consent-dialog-in{animation:csb-consent-fade-scale .25s ease-out both}
@keyframes csb-consent-slide-up{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes csb-consent-fade-scale{from{transform:scale(.97);opacity:0}to{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){.csb-consent-banner-in,.csb-consent-dialog-in{animation:none}}
`;

export function ConsentEntryCss() {
  return (
    <style href="csb-consent" precedence="csb">
      {CONSENT_ENTRY_CSS}
    </style>
  );
}
