import type { Locale } from "@/types/sanity";

import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { PullQuoteSwiperLazy } from "./lazy";
import { hpSectionClass } from "@/components/homepage/shared";

/**
 * Homepage testimonials slider. Fetches `featured` testimonial docs from
 * Sanity (server-side) and hands off to a client child that mounts Swiper.
 *
 * Returns `null` if Sanity has no testimonials yet — the homepage simply
 * skips this section rather than rendering an empty block.
 */
export async function PullQuoteSwiper({
  locale = "uk",
}: {
  locale?: Locale;
}) {
  const slides = await fetchTestimonialSlides(locale);
  if (slides.length === 0) return null;
  return (
    <section className={hpSectionClass}>
      {/* Reserve the slide's height so the lazily-loaded (ssr:false) carousel
          swaps in without shifting layout (keeps CLS ≈ 0). Matches the
          .hp-pqs-slide min-heights in vendor.css across breakpoints. */}
      <div className="hp-pqs min-h-[480px] max-[1100px]:min-h-[440px] max-[900px]:min-h-[320px] max-sm:min-h-[280px]">
        <div className="hp-pqs-bg" aria-hidden="true" />
        <PullQuoteSwiperLazy slides={slides} />
      </div>
    </section>
  );
}
