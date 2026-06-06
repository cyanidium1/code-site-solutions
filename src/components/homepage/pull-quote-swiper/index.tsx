import type { TestimonialSlide } from "@/lib/server/fetch-testimonials";

import { PullQuoteSwiperLazy } from "./lazy";
import { hpSectionClass } from "@/components/homepage/shared";

/**
 * Homepage testimonials slider. The parent page fetches the slides (via
 * `fetchTestimonialSlides`) and passes them in, so the same payload can also
 * feed the page's JSON-LD Review nodes without a second Sanity round-trip.
 *
 * Returns `null` if no slides — the homepage simply skips this section
 * rather than rendering an empty block.
 */
export function PullQuoteSwiper({
  slides,
}: {
  slides: TestimonialSlide[];
}) {
  if (slides.length === 0) return null;
  return (
    <section className={hpSectionClass}>
      {/* Reserve the slide's height so the lazily-loaded (ssr:false) carousel
          swaps in without shifting layout (keeps CLS ≈ 0). Matches the
          .hp-pqs-slide min-heights in vendor.css across breakpoints. */}
      <div className="hp-pqs min-h-[280px] sm:min-h-[320px] min-[901px]:min-h-[440px] min-[1101px]:min-h-[480px]">
        <div className="hp-pqs-bg" aria-hidden="true" />
        <PullQuoteSwiperLazy slides={slides} />
      </div>
    </section>
  );
}
