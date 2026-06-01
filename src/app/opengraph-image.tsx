import { ImageResponse } from "next/og";

// Site-wide default social card. Applies to every route (and doubles as the
// Twitter `summary_large_image` since no separate twitter-image is defined).
// Text is intentionally latin-only so satori's built-in font renders it
// without bundling a Cyrillic typeface.
export const alt = "Code-Site.Art — custom-coded websites for business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #7c4dde 0%, #5d2dad 100%)",
            }}
          >
            <svg
              width={52}
              height={52}
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
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            Code-Site.Art
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Custom-coded websites that book meetings 24/7
          </div>
          <div style={{ fontSize: 30, color: "#b7a8d6" }}>
            Live in 4–10 weeks · Fixed price · 1-year warranty
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
    { ...size },
  );
}
