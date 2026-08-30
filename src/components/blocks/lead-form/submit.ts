import type { LeadValues } from "@/types/lead";
import { getAttribution } from "@/lib/client/attribution";
import { trackLead } from "@/lib/client/analytics";

/**
 * POSTs the lead values to `/api/lead`. Throws on non-2xx so callers can
 * branch on success/error.
 *
 * The analytics event fires here rather than at the call sites: both the full
 * form and the hero mini-calculator go through this function, so one place
 * covers every enquiry the site can produce, now and later.
 */
export async function submitLead(
  values: LeadValues,
  source: string | undefined,
): Promise<void> {
  const attribution = getAttribution();
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, source, attribution }),
  });
  if (!res.ok) throw new Error("API error");
  trackLead(source, attribution);
}
