import type * as React from "react";

import { SITE_CONTACT } from "@/constants/site";

export type SocialKind = "li" | "ig" | "tg" | "tt";

export const FOOTER_SOCIAL_HREFS: Record<SocialKind, string> = {
  li: SITE_CONTACT.linkedin,
  ig: SITE_CONTACT.instagram,
  tg: SITE_CONTACT.telegram,
  tt: SITE_CONTACT.tiktok,
};

export function SocialIcon({ kind }: { kind: SocialKind }) {
  const paths: Record<SocialKind, React.ReactElement> = {
    li: (
      <path
        d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v2c.6-1.2 2-2 4-2 3 0 4 2 4 5v5h-4v-4c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    ig: (
      <>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" />
      </>
    ),
    tg: (
      <path
        d="M21 4L3 11l5 2 2 6 3-3 5 4 3-16z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    tt: (
      <path
        d="M14 4v10.5a2.5 2.5 0 11-2.5-2.5M14 4c.5 2 2 3.5 4.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      {paths[kind]}
    </svg>
  );
}
