/**
 * City blog posts that duplicated the city service pages (TZ v2 §3.14):
 * same intent, same city, weaker page. They 301 to the city page and drop
 * out of the sitemap.
 *
 * Kept import-free on purpose — `next.config.ts` is compiled without the
 * `@/…` path aliases, so anything it imports must resolve relatively and
 * pull in nothing else.
 *
 * Key = uk blog slug; `ru` = the same post's ru slug.
 */
export const BLOG_TO_CITY_PAGE: Record<string, { city: string; ru?: string }> = {
  "rozrobka-saitu-kyiv": { city: "/rozrobka-saitiv-kyiv", ru: "razrabotka-sayta-kiev" },
  "rozrobka-saitu-lviv": { city: "/rozrobka-saitiv-lviv", ru: "razrabotka-sayta-lvov" },
  "rozrobka-saitu-odesa": { city: "/rozrobka-saitiv-odesa", ru: "razrabotka-sayta-odessa" },
  "rozrobka-saitu-dnipro": { city: "/rozrobka-saitiv-dnipro", ru: "razrabotka-sayta-dnepr" },
  "rozrobka-saitu-kharkiv": { city: "/rozrobka-saitiv-kharkiv", ru: "razrabotka-sayta-harkov" },
};
