import type { MarqueeLogo } from "@/types/homepage";

const DEFAULT_MARQUEE: MarqueeLogo[] = [
  { src: "/partners/efedra.webp", alt: "Efedra Clinic" },
  { src: "/partners/tatarka.webp", alt: "Tatarka" },
  { src: "/partners/aleko.webp", alt: "Aleko" },
  { src: "/partners/solid-renovation.webp", alt: "Solid Renovation" },
  { src: "/partners/art-lover.webp", alt: "Art Lover" },
  { src: "/partners/bravo.webp", alt: "Bravo" },
  { src: "/partners/clarion.webp", alt: "Clarion" },
  { src: "/partners/finance-league.webp", alt: "Finance League" },
  { src: "/partners/glimmer.webp", alt: "Glimmer" },
  { src: "/partners/grinchenko.webp", alt: "Grinchenko" },
  { src: "/partners/kondor.webp", alt: "Kondor" },
  { src: "/partners/raul-auto.webp", alt: "Raul Auto" },
  { src: "/partners/sytnykov.webp", alt: "Sytnykov" },
  { src: "/partners/uneed.webp", alt: "Uneed" },
  { src: "/partners/way-to-ireland.webp", alt: "Way to Ireland" },
  { src: "/partners/yangoly.webp", alt: "Yangoly" },
];

export function Marquee({
  label = "47+ КОМПАНІЙ ДОВІРИЛИСЯ · UA · EU · US · DK",
  items = DEFAULT_MARQUEE,
}: {
  label?: string;
  items?: MarqueeLogo[];
}) {
  const repeated = [...items, ...items];
  return (
    <section className="hp-marquee">
      <div className="hp-marquee-label">/ {label}</div>
      <div className="hp-marquee-fade">
        <div className="hp-marquee-track">
          {repeated.map((it, i) => (
            <span key={i} className="hp-marquee-item" title={it.alt}>
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="hp-marquee-logo"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
