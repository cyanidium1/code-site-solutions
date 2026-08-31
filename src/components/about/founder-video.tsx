"use client";

import { useState } from "react";

import { AppImage } from "@/lib/shared/app-image";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { SectionHead } from "@/components/shared/section-head";

/**
 * Click-to-load Vimeo facade for the founder's intro on `/about`.
 *
 * Same principle as `BlogVideo`: nothing from Vimeo is requested until the
 * visitor actually presses play, so the player JS costs the page nothing at
 * LCP/TBT time and no data reaches Vimeo without an explicit action. The
 * difference is the poster — Vimeo has no predictable thumbnail URL the way
 * YouTube does (i.ytimg.com/vi/<id>), and fetching one through oEmbed would
 * put a network call in the build. We already ship a photo of the founder at
 * `/team/fedir.jpg`, and for a video of him talking it is the correct frame
 * anyway.
 */
export function FounderVideo({
  vimeoId,
  eyebrow,
  heading,
  sub,
  playLabel,
  posterAlt,
}: {
  vimeoId: string;
  eyebrow: string;
  /** `[plain, em]` — rendered as `{plain} <em>{em}</em>`, as elsewhere. */
  heading: [string, string];
  sub: string;
  playLabel: string;
  posterAlt: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead
          eyebrow={eyebrow}
          heading={
            <>
              {heading[0]}
              <em>{heading[1]}</em>
            </>
          }
          sub={sub}
        />
        <div className="relative mx-auto aspect-video max-w-container-narrow overflow-hidden rounded-[18px] border border-line bg-[oklch(0_0_0/0.6)]">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
              title={posterAlt}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={playLabel}
              className="group absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <AppImage
                src="/team/fedir.jpg"
                alt={posterAlt}
                fill
                sizes="(max-width: 960px) 92vw, 900px"
                className="object-cover object-center opacity-70 transition-opacity duration-300 group-hover:opacity-85"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(transparent_35%,oklch(0_0_0/0.75))]"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 inline-flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[oklch(0_0_0/0.45)] text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
              >
                <svg width="20" height="22" viewBox="0 0 18 20" fill="none">
                  <path
                    d="M1.5 2.1v15.8c0 1.2 1.3 1.9 2.3 1.3l13-7.9c1-.6 1-2 0-2.6l-13-7.9c-1-.6-2.3.1-2.3 1.3z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="absolute inset-x-0 bottom-0 px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-[oklch(1_0_0/0.85)]">
                {playLabel}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
