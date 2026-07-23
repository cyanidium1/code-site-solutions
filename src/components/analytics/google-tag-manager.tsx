"use client";

import { useEffect } from "react";
import { GTM_ID } from "@/constants/site";

/**
 * Google Tag Manager container. GTM hosts the rest of the marketing stack
 * (GA4, Meta Pixel, Clarity, etc.) so this single loader is the only
 * tracking code the app needs.
 *
 * Loading is gated on the first user interaction (pointer/key/touch/scroll)
 * with an idle-timeout fallback. `lazyOnload` (the previous strategy) still
 * landed GTM+Clarity's ~1.3 s of script evaluation inside the Lighthouse
 * trace window, inflating TBT and delaying the hero LCP paint. Real visitors
 * interact within the fallback window, so field data keeps flowing; sessions
 * that bounce in under IDLE_FALLBACK_MS with zero interaction are the
 * accepted cost (decision recorded in docs/perf-log.md, 2026-07-23).
 *
 * The consent-mode default state is still set synchronously by the inline
 * ConsentBootstrap script before this mounts; consent updates pushed to
 * dataLayer while GTM is not yet loaded queue in the array and are replayed
 * by the container on load.
 */
const IDLE_FALLBACK_MS = 8000;

type WindowWithGtm = Window & {
  dataLayer?: unknown[];
  __gtmInjected?: boolean;
};

function injectGtm() {
  const w = window as WindowWithGtm;
  if (w.__gtmInjected) return;
  w.__gtmInjected = true;
  const dl = (w.dataLayer = w.dataLayer ?? []);
  dl.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export function GoogleTagManager() {
  useEffect(() => {
    if ((window as WindowWithGtm).__gtmInjected) return;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    let timer = 0;
    const fire = () => {
      cleanup();
      injectGtm();
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, fire);
    };
    for (const e of events)
      window.addEventListener(e, fire, { passive: true, once: true });
    timer = window.setTimeout(fire, IDLE_FALLBACK_MS);
    return cleanup;
  }, []);

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        className="hidden"
        title="Google Tag Manager"
      />
    </noscript>
  );
}
