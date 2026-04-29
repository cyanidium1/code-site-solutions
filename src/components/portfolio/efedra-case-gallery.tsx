"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useCallback, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export type EfedraGalleryTile = {
  label: string;
  src: string;
  alt: string;
};

const captionStyles: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "10px 14px",
  background: "linear-gradient(transparent, oklch(0 0 0 / 0.65))",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 11,
  letterSpacing: "0.06em",
  color: "oklch(1 0 0 / 0.92)",
  zIndex: 2,
  pointerEvents: "none",
};

const figureStyles: CSSProperties = {
  margin: 0,
  aspectRatio: "16/10",
  borderRadius: 22,
  overflow: "hidden",
  border: "1px solid var(--line)",
  position: "relative",
  background: "oklch(0.08 0.02 280)",
};

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
      <section className="hp-section" style={{ paddingBottom: 20 }}>
        <div className="hp-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {tiles.map((t, i) => (
              <figure
                key={`${t.src}-${i}`}
                style={figureStyles}
                role="button"
                tabIndex={0}
                aria-label={`Відкрити на весь екран: ${t.label}`}
                className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2"
                onClick={() => openAt(i)}
                onKeyDown={(e) => onCardKeyDown(e, i)}
              >
                <img
                  src={t.src}
                  alt={t.alt}
                  decoding="async"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 block h-full w-full object-cover object-top"
                />
                <figcaption style={captionStyles}>{t.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex < 0 ? 0 : lightboxIndex}
        slides={slides}
      />
    </>
  );
}
