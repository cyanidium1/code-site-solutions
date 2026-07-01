import type { CalculatorInput } from "@/types/pricing";

/**
 * Client-only persistence for the calculator's in-progress selections.
 * Stored on every change, cleared on a manual reset or a successful lead
 * submit (see WebsiteCalculator). Bumped suffix invalidates old shapes.
 */
const STORAGE_KEY = "cs-calculator-input-v3";

function isValidInput(v: unknown): v is CalculatorInput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.projectType === "string" &&
    typeof o.pages === "number" &&
    typeof o.designComplexity === "string" &&
    typeof o.languages === "string" &&
    typeof o.contentOption === "string" &&
    typeof o.timeline === "string" &&
    Array.isArray(o.cmsUpgradeIds) &&
    Array.isArray(o.seoOptionIds) &&
    Array.isArray(o.featureIds)
  );
}

export function loadStoredInput(): CalculatorInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredInput(input: CalculatorInput): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch {
    /* quota / private mode — persistence is best-effort */
  }
}

export function clearStoredInput(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
