import * as Yup from "yup";

import type { LeadValues } from "@/types/lead";

export const INITIAL_LEAD_VALUES: LeadValues = {
  name: "",
  contact: "",
  business: "",
  tier: "",
  description: "",
  budget: "",
  timeline: "",
  hp: "",
};

/**
 * Build the Yup schema for the lead form. Only the `contact` field is
 * required (and validated as a single string — phone / Telegram handle /
 * email — because users mix the three). The error message is provided by
 * the caller so it can stay localized.
 */
export function buildValidationSchema(contactErr: string) {
  return Yup.object({
    name: Yup.string(),
    contact: Yup.string().min(5, contactErr).required(contactErr),
    business: Yup.string(),
    tier: Yup.string(),
    description: Yup.string(),
    budget: Yup.string(),
    timeline: Yup.string(),
  });
}
