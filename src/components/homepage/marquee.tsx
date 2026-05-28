import type { MarqueeLogo } from "@/types/homepage";

const DEFAULT_MARQUEE: MarqueeLogo[] = [
  { src: "/partners/efedra.webp", alt: "Efedra Clinic" },
  { src: "/partners/tatarka.svg", alt: "Tatarka" },
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
  label = "50+ КОМПАНІЙ ДОВІРИЛИСЯ · UA · EU · US · DK · ZA · UK · FR",
  items = DEFAULT_MARQUEE,
}: {
  label?: string;
  items?: MarqueeLogo[];
}) {
  const repeated = [...items, ...items];
  return (
    <section className="group/marquee relative z-[11] overflow-hidden border-y border-line bg-bg py-8">
      <div className="mb-6 text-center px-6 sm:px-8 lg:px-12 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
        / {label}
      </div>
      <div className="relative [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div className="flex w-max items-center gap-16 px-8 [animation:marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
          {repeated.map((it, i) => (
            <span
              key={i}
              className="inline-flex h-11 shrink-0 items-center justify-center"
              title={it.alt}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-auto max-w-[160px] object-contain opacity-55 [filter:brightness(0)_invert(1)] transition-opacity duration-300"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
