import { SITE_ORIGIN } from "@/constants/site";

export function pageUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_ORIGIN}${path}`;
}
