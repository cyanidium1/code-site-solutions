import { buildBootstrapScript } from "../core/bootstrap-script";

/**
 * Inline GCM v2 bootstrap — MUST render before <GoogleTagManager /> in the
 * root layouts. Server component; a single inline script guarantees the
 * default-denied push executes before GTM regardless of script hoisting
 * (React 19 moves async scripts into <head>).
 */
export function ConsentBootstrap() {
  return (
    <script id="consent-gcm" dangerouslySetInnerHTML={{ __html: buildBootstrapScript() }} />
  );
}
