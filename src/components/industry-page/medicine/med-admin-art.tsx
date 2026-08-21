/**
 * Coded admin-panel artwork.
 *
 * Direct descendant of code-site-frontend's MockupArt (`MockupAdmin`): the old
 * site drew its product shots as vectors instead of shipping screenshots, so
 * they stayed crisp, weighed nothing, and could be recoloured with the brand.
 * Retuned here to the current palette — #121212 surfaces, hairline borders,
 * violet for the active/primary affordance, --med-vital only on the rows that
 * represent a confirmed booking.
 *
 * It replaces the faded stock photography that sat behind the capability
 * cards at ~8% opacity: that treatment says nothing about the product, and
 * "photo dimmed to near-invisible behind a card" is one of the reliable
 * signatures of a generated layout.
 */
export function MedAdminArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 340"
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label="Clinic admin panel: services, practitioners and incoming bookings"
    >
      <defs>
        <linearGradient id="med-adm-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.7 0.14 295)" />
          <stop offset="100%" stopColor="oklch(0.55 0.18 295)" />
        </linearGradient>
      </defs>

      {/* Window */}
      <rect width="480" height="340" rx="14" fill="#101010" />
      <rect
        x="0.5"
        y="0.5"
        width="479"
        height="339"
        rx="13.5"
        fill="none"
        stroke="oklch(1 0 0 / 0.1)"
      />

      {/* Chrome */}
      <g>
        <circle cx="20" cy="18" r="3.5" fill="oklch(1 0 0 / 0.14)" />
        <circle cx="32" cy="18" r="3.5" fill="oklch(1 0 0 / 0.14)" />
        <circle cx="44" cy="18" r="3.5" fill="oklch(1 0 0 / 0.14)" />
        <rect
          x="140"
          y="11"
          width="200"
          height="14"
          rx="7"
          fill="oklch(1 0 0 / 0.04)"
        />
        <rect x="160" y="16" width="120" height="4" rx="2" fill="oklch(1 0 0 / 0.16)" />
        <path d="M0 36 H480" stroke="oklch(1 0 0 / 0.08)" />
      </g>

      {/* Sidebar */}
      <g>
        <path d="M116 36 V340" stroke="oklch(1 0 0 / 0.08)" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 56 + i * 30;
          const active = i === 3;
          return (
            <g key={i}>
              {active ? (
                <rect
                  x="12"
                  y={y - 9}
                  width="92"
                  height="24"
                  rx="6"
                  fill="oklch(from var(--color-accent) l c h / 0.16)"
                />
              ) : null}
              <rect
                x="22"
                y={y - 2}
                width="7"
                height="7"
                rx="1.5"
                fill={active ? "url(#med-adm-accent)" : "oklch(1 0 0 / 0.28)"}
              />
              <rect
                x="37"
                y={y - 1}
                width={active ? 54 : 44 + (i % 3) * 8}
                height="5"
                rx="2.5"
                fill={active ? "oklch(1 0 0 / 0.9)" : "oklch(1 0 0 / 0.34)"}
              />
            </g>
          );
        })}
      </g>

      {/* Header row */}
      <rect x="136" y="54" width="104" height="9" rx="3" fill="oklch(1 0 0 / 0.85)" />
      <rect x="136" y="70" width="150" height="5" rx="2.5" fill="oklch(1 0 0 / 0.3)" />
      <rect x="386" y="52" width="76" height="24" rx="12" fill="url(#med-adm-accent)" />
      <rect x="404" y="61" width="40" height="6" rx="3" fill="oklch(1 0 0 / 0.95)" />

      {/* Table head */}
      <g transform="translate(136, 96)">
        <rect width="326" height="22" rx="6" fill="oklch(1 0 0 / 0.045)" />
        <rect x="12" y="8" width="52" height="5" rx="2.5" fill="oklch(1 0 0 / 0.34)" />
        <rect x="126" y="8" width="40" height="5" rx="2.5" fill="oklch(1 0 0 / 0.34)" />
        <rect x="200" y="8" width="34" height="5" rx="2.5" fill="oklch(1 0 0 / 0.34)" />
        <rect x="266" y="8" width="44" height="5" rx="2.5" fill="oklch(1 0 0 / 0.34)" />
      </g>

      {/* Booking rows — the two newest are confirmed (vital), rest pending */}
      <g transform="translate(136, 126)">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const confirmed = i < 2;
          return (
            <g key={i} transform={`translate(0, ${i * 33})`}>
              <rect width="326" height="26" rx="6" fill="oklch(1 0 0 / 0.025)" />
              <circle
                cx="22"
                cy="13"
                r="8"
                fill={
                  confirmed
                    ? "oklch(from var(--med-vital) l c h / 0.18)"
                    : "oklch(1 0 0 / 0.05)"
                }
              />
              <rect
                x="38"
                y="10"
                width={68 + (i % 3) * 14}
                height="6"
                rx="3"
                fill="oklch(1 0 0 / 0.7)"
              />
              <rect x="200" y="10" width="30" height="6" rx="3" fill="oklch(1 0 0 / 0.36)" />
              <rect
                x="266"
                y="7"
                width="52"
                height="12"
                rx="6"
                fill={
                  confirmed
                    ? "oklch(from var(--med-vital) l c h / 0.16)"
                    : "oklch(1 0 0 / 0.05)"
                }
              />
              <rect
                x="276"
                y="11"
                width="32"
                height="4"
                rx="2"
                fill={confirmed ? "var(--med-vital)" : "oklch(1 0 0 / 0.3)"}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
