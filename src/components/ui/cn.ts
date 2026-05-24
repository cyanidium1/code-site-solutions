import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names: clsx for conditional logic, twMerge to resolve
 * conflicting utilities (e.g. "p-4 p-6" → "p-6"). Used by every primitive in
 * src/components/ui/.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
