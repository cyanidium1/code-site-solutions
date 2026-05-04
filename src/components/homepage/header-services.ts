/** Короткі назви для меню — render only entries that resolve to a published
 *  industryPage in Sanity. Add new entries as the marketing team ships them
 *  in Studio. Translation keys (`key`) live in `messages/{uk,en}.json` →
 *  `ServiceNav`. */
export const SERVICE_NAV_LINKS = [
  { href: "/sites-for/medicine", key: "medicine" },
  { href: "/sites-for/renovation", key: "renovation" },
] as const;
