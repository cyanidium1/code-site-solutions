import { SanityImg } from "@/lib/shared/sanity-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import type { SanityImage } from "@/types/sanity";

export function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const VISUAL_SHELL =
  "relative rounded-[14px] border border-line-strong bg-[linear-gradient(135deg,oklch(0.18_0.005_300),oklch(0.14_0.006_300))] aspect-[16/11] overflow-hidden flex items-center justify-center shadow-[0_30px_60px_oklch(0_0_0_/_0.4)] md:aspect-[4/3] md:rounded-[18px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.04)_1px,transparent_0)] before:bg-[length:20px_20px]";

export const VISUAL_CONTENT =
  "absolute inset-0 p-6 flex flex-col gap-3.5";

export const CHECK_PILL =
  "w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center bg-accent-18 text-accent-soft border border-accent-30";

export const BENEFIT_LIST =
  "flex flex-col gap-3 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.55] [&>li]:text-ink-dim [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium [&>li_mark]:bg-accent-18 [&>li_mark]:text-accent-soft [&>li_mark]:px-1.5 [&>li_mark]:py-px [&>li_mark]:rounded [&>li_mark]:font-medium md:[&>li]:text-[14px]";

// Real uploaded screenshot inside the same shell as the mocks.
// Used when a benefit row has an image; otherwise one of the CSS mocks renders.
export function MockImage({
  image,
  alt,
}: { image: SanityImage; alt: string }) {
  return (
    <div className={VISUAL_SHELL}>
      <div className="absolute inset-0 overflow-hidden">
        <SanityImg
          image={image}
          alt={alt}
          fill
          sizes={IMG_SIZES.half}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export function MockPages({ tags }: { tags: React.ReactNode[] }) {
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_CONTENT}>
        <div className="grid grid-cols-3 gap-2 h-full md:gap-3">
          {tags.map((t, i) => (
            <div
              key={i}
              className="bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg px-1.5 py-2 flex flex-col gap-2 md:px-2.5 md:py-3"
            >
              <div className="font-mono text-[8px] text-accent-soft tracking-[0.08em] uppercase">
                {t}
              </div>
              <div className="h-[32%] min-h-9 bg-[linear-gradient(135deg,oklch(from_var(--color-accent)_l_c_h_/_0.2),oklch(0.3_0.01_300))] rounded-[5px]" />
              <div className="h-1 bg-[oklch(1_0_0_/_0.1)] rounded-[2px]" />
              <div className="h-1 bg-[oklch(1_0_0_/_0.1)] rounded-[2px] w-[60%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCK_FORM_STRINGS = {
  uk: {
    heading: "Запис на консультацію",
    name: "Олена Петрова",
    phone: "+380 ··",
    service: "Стоматологія / гігієна",
    cta: "Записатися",
  },
  en: {
    heading: "Book a consultation",
    name: "Emma Petersen",
    phone: "+44 ··",
    service: "Dental hygiene",
    cta: "Book →",
  },
} as const;

export function MockBookingForm({
  locale = "uk",
}: {
  locale?: string;
}) {
  const s =
    locale === "en" ? MOCK_FORM_STRINGS.en : MOCK_FORM_STRINGS.uk;
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_CONTENT}>
        <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.08)] rounded-[10px] p-3.5 m-auto w-[86%] flex flex-col gap-2.5 shadow-[0_20px_40px_oklch(0_0_0_/_0.4)] md:w-[70%] md:p-[18px]">
          <div className="font-display text-[11px] font-semibold text-ink mb-1 tracking-[-0.01em]">
            {s.heading}
          </div>
          <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-ink-3">
            {s.name}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-ink-3">
              {s.phone}
            </div>
            <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-ink-3">
              17:30
            </div>
          </div>
          <div className="h-[26px] bg-[oklch(0.22_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-ink-3">
            {s.service}
          </div>
          <div className="h-[30px] mt-1 bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] rounded-md flex items-center justify-center font-display text-[10px] font-semibold text-[oklch(1_0_0_/_0.95)] tracking-[0.02em]">
            {s.cta}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockAdmin() {
  return (
    <div className={VISUAL_SHELL}>
      <div className={VISUAL_CONTENT}>
        <div className="grid grid-cols-[110px_1fr] gap-3 h-full">
          <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg pt-3.5 px-2.5 pb-3.5 flex flex-col gap-2">
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-accent-30 border-l-2 border-l-accent-soft rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[18px] bg-[oklch(0.22_0.005_300)] rounded" />
          </div>
          <div className="bg-[oklch(0.16_0.005_300)] border border-[oklch(1_0_0_/_0.06)] rounded-lg p-3.5 flex flex-col gap-2.5">
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[60px] bg-[oklch(0.22_0.005_300)] rounded" />
            <div className="h-[22px] bg-[oklch(0.22_0.005_300)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
