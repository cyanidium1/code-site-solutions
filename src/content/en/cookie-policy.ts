export type CookieRow = { name: string; provider: string; purpose: string; ttl: string };
export type CookiePolicySection = { heading: string; rows: CookieRow[] };

export type CookiePolicyCopy = {
  eyebrow: string;
  title: string;
  sub: string;
  intro: string;
  manage: string;
  updated: string;
  tableHead: { name: string; provider: string; purpose: string; ttl: string };
  sections: CookiePolicySection[];
};

export const cookiePolicyEn: CookiePolicyCopy = {
  eyebrow: "/ LEGAL",
  title: "Cookie Policy",
  sub: "Which cookies code-site.art uses, why, and how to change your choice.",
  intro:
    "Cookies are small text files stored in your browser. We only set analytics and marketing cookies after you allow them via the consent banner (Google Consent Mode v2). Your choice is kept for 12 months and can be changed at any time.",
  manage:
    "To change or withdraw consent, use “Cookie settings” in the site footer — the preferences window reopens instantly.",
  updated: "Last updated: 2 July 2026",
  tableHead: { name: "Cookie", provider: "Provider", purpose: "Purpose", ttl: "Duration" },
  sections: [
    {
      heading: "Necessary — always on",
      rows: [
        {
          name: "cs-consent",
          provider: "code-site.art (first-party)",
          purpose: "Stores your cookie consent choice.",
          ttl: "12 months",
        },
      ],
    },
    {
      heading: "Analytics — only with your consent",
      rows: [
        {
          name: "_ga",
          provider: "Google Analytics 4",
          purpose: "Distinguishes visitors for anonymous usage statistics.",
          ttl: "2 years",
        },
        {
          name: "_ga_*",
          provider: "Google Analytics 4",
          purpose: "Keeps session state for usage statistics.",
          ttl: "2 years",
        },
      ],
    },
    {
      heading: "Marketing — only with your consent",
      rows: [
        {
          name: "_gcl_au",
          provider: "Google Ads",
          purpose: "Measures ad-campaign conversions.",
          ttl: "3 months",
        },
        {
          name: "_fbp",
          provider: "Meta Pixel",
          purpose: "Measures ad performance and enables remarketing.",
          ttl: "3 months",
        },
      ],
    },
  ],
};
