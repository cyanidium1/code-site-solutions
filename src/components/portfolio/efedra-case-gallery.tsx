"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { SanityImg } from "@/lib/shared/sanity-image";

// Defer the lightbox JS AND its stylesheet until a tile is actually opened —
// via ./lightbox-lazy, which owns the CSS side-effect inside the dynamic
// boundary so ~5.6 KB of lightbox CSS no longer render-blocks pages with a
// gallery (and no longer leaks onto the homepage). Most visitors never trigger it.
const Lightbox = dynamic(() => import("./lightbox-lazy"), {
  ssr: false,
});

export type EfedraGalleryTile = {
  label: string;
  src: string;
  alt: string;
};

// Tailwind utility strings extracted to constants to keep the JSX readable.
const FIGURE_CLASS =
  "relative m-0 aspect-[16/10] overflow-hidden rounded-[22px] border border-line bg-[oklch(0.08_0.02_280)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2";

const CAPTION_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-[linear-gradient(transparent,oklch(0_0_0/0.65))] px-3.5 py-2.5 font-mono text-[11px] tracking-[0.06em] text-[oklch(1_0_0/0.92)]";

export function EfedraCaseGallery({ tiles }: { tiles: EfedraGalleryTile[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = tiles.map((t) => ({ src: t.src, alt: t.alt }));

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const onCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAt(index);
      }
    },
    [openAt],
  );

  return (
    <>
      <section className={`${hpSectionClass} pb-5`}>
        <div className={hpInnerClass}>
          <div className="grid grid-cols-2 gap-5">
            {tiles.map((t, i) => (
              <figure
                key={`${t.src}-${i}`}
                role="button"
                tabIndex={0}
                aria-label={`Відкрити на весь екран: ${t.label}`}
                className={FIGURE_CLASS}
                onClick={() => openAt(i)}
                onKeyDown={(e) => onCardKeyDown(e, i)}
              >
                <SanityImg
                  image={t.src}
                  alt={t.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 600px"
                  className="pointer-events-none object-cover object-top"
                />
                <figcaption className={CAPTION_CLASS}>{t.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      {lightboxIndex >= 0 && (
        <Lightbox
          open
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides}
        />
      )}
    </>
  );
}
