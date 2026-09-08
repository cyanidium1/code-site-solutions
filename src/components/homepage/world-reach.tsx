import { MAP_VIEWBOX, WorldMapDots } from "./world-map-dots";
import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSectionHeadClass,
  hpSubClass,
} from "./shared";

/**
 * "Where the work has shipped" — the dotted world map with the studio's own
 * markets lit up.
 *
 * The homepage claimed "7 countries: UA · EU · US · DK · ZA · UK · FR" as a
 * line of 10px text inside a stat cell. The previous code-site.art build had
 * an animated dotted map and nothing to say with it; this pairs the two, so
 * the geography claim is the graphic rather than a caption.
 *
 * The map is equirectangular (verified against seven cities: every pin lands
 * within one dot spacing of its real coordinates), so pins are placed from
 * actual latitude/longitude of the projects rather than eyeballed.
 *
 * No JavaScript: the pulse is a CSS keyframe with a per-pin delay, and the
 * whole thing holds still under `prefers-reduced-motion`.
 */
type Pin = {
  /** Label shown next to the country list. */
  label: string;
  lat: number;
  lon: number;
};

/** Real project locations. Order sets the pulse sequence. */
const PINS: Pin[] = [
  { label: "UA", lat: 46.48, lon: 30.73 }, // Odesa — Efedra Clinic
  { label: "UA", lat: 50.45, lon: 30.52 }, // Kyiv
  { label: "DK", lat: 55.68, lon: 12.57 }, // Copenhagen — NBYG
  { label: "DK", lat: 55.1, lon: 14.9 }, // Bornholm — NBYG
  { label: "FR", lat: 48.86, lon: 2.35 }, // Paris — Solide Renovation
  { label: "IE", lat: 53.35, lon: -6.26 }, // Dublin — Way to Ireland
  { label: "UK", lat: 51.51, lon: -0.13 }, // London
  { label: "AL", lat: 41.33, lon: 19.82 }, // Tirana — Domlivo
  { label: "US", lat: 40.71, lon: -74.01 }, // New York
  { label: "ZA", lat: -33.92, lon: 18.42 }, // Cape Town
];

const project = ({ lat, lon }: Pin) => ({
  cx: ((lon + 180) / 360) * MAP_VIEWBOX.w,
  cy: ((90 - lat) / 180) * MAP_VIEWBOX.h,
});

export function WorldReach({
  eyebrow,
  heading,
  sub,
  countries,
  foot,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  sub: string;
  /** Country chips under the copy, e.g. ["Україна", "Данія", …]. */
  countries: string[];
  foot?: string;
}) {
  return (
    <section className={hpSectionClass} id="reach">
      <div className={hpInnerClass}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{eyebrow}</span>
            </div>
            <h2 className={hpH2Class}>{heading}</h2>
            <p className={hpSubClass}>{sub}</p>
            <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
              {countries.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-dim"
                >
                  {c}
                </li>
              ))}
            </ul>
            {foot ? (
              <p className="mt-5 max-w-[46ch] text-[13px] leading-[1.6] text-ink-3">
                {foot}
              </p>
            ) : null}
          </div>

          {/* The bloom sits behind the map, never as a shadow under it. */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,var(--color-accent-20),transparent_70%)] blur-[70px]"
            />
            <div className="relative">
              <WorldMapDots className="w-full text-[oklch(1_0_0_/_0.22)]" />
              <svg
                viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
                className="pointer-events-none absolute inset-0 w-full overflow-visible"
                aria-hidden="true"
              >
                {PINS.map((pin, i) => {
                  const { cx, cy } = project(pin);
                  return (
                    <g
                      key={`${pin.label}-${i}`}
                      className="hp-map-pin"
                      // eslint-disable-next-line react/forbid-dom-props -- --i is the per-pin animation-delay index; a static utility cannot express ten staggered delays
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <circle cx={cx} cy={cy} r="9" className="hp-map-pin-halo" />
                      <circle cx={cx} cy={cy} r="3.1" className="hp-map-pin-core" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
