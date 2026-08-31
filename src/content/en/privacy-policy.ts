import { SITE_CONTACT } from "@/constants/site";

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDocCopy = {
  eyebrow: string;
  title: string;
  sub: string;
  intro: string;
  sections: LegalSection[];
  /** Trailing "cookies are covered separately" line — privacy policy only. */
  cookiesNote?: string;
  cookiesHref?: string;
  cookiesLinkLabel?: string;
  updated: string;
};

/**
 * Written against what the code actually does, not from a template:
 * the field list matches `LeadValues`, the attribution list matches
 * `LeadAttribution`, the IP handling matches the rate limiter in
 * `app/api/lead/route.ts`, and the recipient is the Telegram Bot API call
 * that route makes. If any of those change, this file changes with them.
 */
export const privacyPolicyEn: LegalDocCopy = {
  eyebrow: "/ LEGAL",
  title: "Privacy Policy",
  sub: "What we collect when you contact us, where it goes, and how to have it removed.",
  intro:
    "Code-Site.Art is a web development studio. This page describes exactly what happens to the data you give us — there is no hidden processing behind it. Short version: the enquiry form goes straight to our own messenger, we do not sell anything to anyone, and analytics only start after you allow them.",
  sections: [
    {
      heading: "Who is responsible",
      blocks: [
        {
          kind: "p",
          text: `Code-Site.Art operates this site and decides how the data described below is used. For any question about your data, or to have it deleted, write to ${SITE_CONTACT.email} — the same address answers privacy requests and project enquiries, and a real person reads it.`,
        },
      ],
    },
    {
      heading: "What the enquiry form collects",
      blocks: [
        {
          kind: "p",
          text: "The form on this site asks for the following. Only the name and the contact are needed to reply to you; everything else exists so the first call is useful rather than a round of basic questions.",
        },
        {
          kind: "ul",
          items: [
            "Your name, or whatever you would like to be called.",
            "One contact — a phone number, a messenger handle or an email address. You choose which.",
            "Your business or project name.",
            "The type of site you are after and your description of the project.",
            "Your budget range and desired timeline.",
          ],
        },
        {
          kind: "p",
          text: "The site calculator works entirely in your browser. Nothing you enter into it reaches us unless you press send on the form.",
        },
      ],
    },
    {
      heading: "What is attached to your enquiry automatically",
      blocks: [
        {
          kind: "p",
          text: "So we know which page brought you and what you were reading, the following is attached to the enquiry you send. It is held in your browser for the duration of the visit and is discarded when you close the tab.",
        },
        {
          kind: "ul",
          items: [
            "The site you arrived from, if you followed a link (the domain only, not the full address).",
            "The first page you landed on and the pages you opened afterwards.",
            "Campaign tags (utm_*) if the link you followed carried any.",
            "The time your visit started.",
          ],
        },
        {
          kind: "p",
          text: "Your IP address is read from the request when the form is submitted, and is used for one thing: refusing more than six submissions a minute from the same address, so the form cannot be used to flood us. It is held in the server's memory for that minute and is never written to disk or attached to your enquiry.",
        },
      ],
    },
    {
      heading: "Where it goes",
      blocks: [
        {
          kind: "p",
          text: "A submitted enquiry is delivered to a private studio chat through the Telegram Bot API and is read by the people who will actually work on your project. It is not loaded into a CRM, not added to a mailing list, not sold, and not shared with advertisers or data brokers. If a project starts, the correspondence continues over the channel you chose.",
        },
      ],
    },
    {
      heading: "Why we are allowed to do this",
      blocks: [
        {
          kind: "ul",
          items: [
            "Handling your enquiry and preparing a quote: because you asked us to, as a step towards a possible contract (GDPR Art. 6(1)(b)).",
            "Analytics and marketing tags: only with your consent, given through the cookie banner and withdrawable at any time (GDPR Art. 6(1)(a)).",
            "Rate limiting the form: our legitimate interest in keeping the site usable (GDPR Art. 6(1)(f)).",
          ],
        },
      ],
    },
    {
      heading: "Analytics and session recording",
      blocks: [
        {
          kind: "p",
          text: "If you allow analytics cookies, two tools run: Google Analytics 4, which counts visits and pages, and Microsoft Clarity, which records anonymised clicks, scrolling and mouse movement so we can see where a page confuses people. Clarity masks text content by default, so what you type into the form is not part of a recording. Decline analytics and neither one loads at all.",
        },
      ],
    },
    {
      heading: "Who else touches the data",
      blocks: [
        {
          kind: "table",
          head: ["Service", "What it does", "Where"],
          rows: [
            ["Vercel", "Hosts and serves the site", "EU / global edge"],
            ["Telegram", "Delivers your enquiry to the studio", "Cloud"],
            ["Sanity", "Stores site content — no visitor data", "EU / US"],
            ["Google Analytics 4", "Visit statistics, with consent", "EU / US"],
            ["Microsoft Clarity", "Anonymised session recording, with consent", "EU / US"],
          ],
        },
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        {
          kind: "p",
          text: "Your enquiry stays in our chat history for as long as we are talking about the project and for the life of any contract that follows, because that correspondence is the record of what was agreed. Ask us to delete it and we will, without asking why.",
        },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        {
          kind: "p",
          text: `Under the GDPR and Ukraine's Law on Personal Data Protection you can ask for a copy of your data, have it corrected or deleted, restrict or object to its use, receive it in a portable form, and withdraw consent to analytics at any time. Write to ${SITE_CONTACT.email} and we will answer within 30 days. If we handle it badly, you can complain to the data protection authority in your country — for Ukraine, the Ukrainian Parliament Commissioner for Human Rights.`,
        },
        {
          kind: "p",
          text: "There is no automated decision-making or profiling on this site, and the service is not directed at children under 16.",
        },
      ],
    },
  ],
  cookiesNote: "Cookies are covered separately, name by name, in our",
  cookiesHref: "/en/cookies",
  cookiesLinkLabel: "Cookie Policy",
  updated: "Last updated: 31 August 2026",
};
