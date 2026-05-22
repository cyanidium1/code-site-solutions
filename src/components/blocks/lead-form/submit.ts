import type { LeadValues } from "@/types/lead";

/**
 * POSTs the lead values to `/api/lead`. Throws on non-2xx so callers can
 * branch on success/error.
 */
export async function submitLead(
  values: LeadValues,
  source: string | undefined,
): Promise<void> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, source }),
  });
  if (!res.ok) throw new Error("API error");
}
