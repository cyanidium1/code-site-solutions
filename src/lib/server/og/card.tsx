import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

// Per-slug social card. Unlike the site-wide /opengraph-image (which relies on
// satori's built-in latin-only font), this one bundles Fira Sans — a static
// TTF with full Cyrillic coverage — so Ukrainian case/post titles render.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Read each weight once and reuse across renders. nft traces the
// `new URL(..., import.meta.url)` reference and bundles the font files.
let fontsPromise: Promise<{ bold: Buffer; regular: Buffer }> | null = null;

function loadFonts() {
  fontsPromise ??= (async () => {
    const [bold, regular] = await Promise.all([
      readFile(new URL("./fonts/FiraSans-Bold.ttf", import.meta.url)),
      readFile(new URL("./fonts/FiraSans-Regular.ttf", import.meta.url)),
    ]);
    return { bold, regular };
  })();
  return fontsPromise;
}

export type OgCardInput = {
  title: string;
  eyebrow: string;
};

export async function renderOgCard({ title, eyebrow }: OgCardInput) {
  const { bold, regular } = await loadFonts();

  // Scale the headline down for long titles so it never overflows the frame.
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(1200px 600px at 80% -10%, #2a1a4a 0%, #121212 60%)",
          color: "#f5f3f7",
          fontFamily: "Fira Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #7c4dde 0%, #5d2dad 100%)",
            }}
          >
            <svg
              width={48}
              height={48}
              viewBox="0 0 64 64"
              fill="none"
              stroke="#ffffff"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M25 23 L16 32 L25 41" />
              <path d="M39 23 L48 32 L39 41" />
              <path d="M35 19 L29 45" />
            </svg>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>
            Code-Site.Art
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b18bff",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#9b8bbf",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: "#7c4dde",
            }}
          />
          code-site.art
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fira Sans", data: bold, weight: 700, style: "normal" },
        { name: "Fira Sans", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
