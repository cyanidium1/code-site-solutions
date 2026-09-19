import * as Yup from "yup";

import type { LeadValues } from "@/types/lead";

export const INITIAL_LEAD_VALUES: LeadValues = {
  name: "",
  contact: "",
  tier: "",
  budget: "",
  hasSite: "",
  siteUrl: "",
  description: "",
  config: "",
  hp: "",
};

/**
 * Contact and budget are required (TZ v2 §5). Contact is one free string —
 * phone / Telegram handle / email — because people mix the three. Messages
 * come from the caller so they stay localized.
 */
export function buildValidationSchema(
  contactErr: string,
  budgetErr: string,
  opts: { requireBudget?: boolean } = {},
) {
  return Yup.object({
    name: Yup.string(),
    contact: Yup.string().min(5, contactErr).required(contactErr),
    tier: Yup.string(),
    budget: opts.requireBudget === false ? Yup.string() : Yup.string().required(budgetErr),
    hasSite: Yup.string(),
    siteUrl: Yup.string(),
    description: Yup.string(),
    config: Yup.string(),
  });
}
