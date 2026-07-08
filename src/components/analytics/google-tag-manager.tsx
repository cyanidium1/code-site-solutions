import Script from "next/script";
import { GTM_ID } from "@/constants/site";

/**
 * Google Tag Manager container. GTM hosts the rest of the marketing stack
 * (GA4, Meta Pixel, heatmaps, etc.) so this single snippet is the only
 * tracking code the app needs to render.
 *
 * Place at the top of <body>: the inline script bootstraps the dataLayer,
 * and the <noscript> iframe is GTM's required JS-disabled fallback.
 */
export function GoogleTagManager() {
  return (
    <>
      {/* lazyOnload: defer GTM (and Clarity, which loads inside the container)
          until after the load event — i.e. after LCP. They contribute ~457ms of
          main-thread execution (Clarity 292ms + GTM 165ms) that otherwise lands
          in the LCP window and delays the hero paint. The consent-mode default
          state is still set synchronously by the inline bootstrap before this. */}
      <Script id="gtm" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          className="hidden"
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
