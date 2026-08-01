import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import { SanityImg } from "@/lib/shared/sanity-image";
import type { SanityImage } from "@/types/sanity";
import { btnClass } from "@/components/ui";
import { CtaArrow } from "@/components/layout/cta-arrow";
import { LOGO_PATHS } from "@/components/layout/logo/logo-svg";

/* ───────────────────────────────────────────────────────────────────────
   HOME HERO — 2026 redesign build of Figma «код сайт арт» frame `1`
   (#1729:1871, 1920×872). Audit with every node id + number:
   docs/home-hero-figma-audit.md. Plan:
   docs/superpowers/plans/2026-08-01-home-hero-rebuild.md.

   Fully server-rendered: no client JS, no keyframes, no backdrop-blur
   above 4px (stats bar), decor blurs are STATIC radial gradients per the
   job-#135 rule (never CSS `blur()` — see docs/glass-ui-patterns.md).

   Coordinate system: decor is positioned in % of the 1920×872 design
   frame so the composition scales with the viewport at xl+; below xl the
   overlays collapse into normal flow (no mobile design exists — the
   ladder mirrors the header's: flow < xl ≤ absolute composition).
   ─────────────────────────────────────────────────────────────────── */

// Page-level backdrop kept during the redesign transition (user decision):
// same fixed dual-radial + grain the old shared hero rendered, so the
// not-yet-redesigned sections below keep their look.
const PAGE_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)]";

// Hero section. Pulls up under the sticky glass-pill header (header flow
// height: 12+56=68 below xl, 21+60=81 at xl+) so the aurora runs behind
// the glass exactly as in the mockup. Height is content-driven below xl;
// at xl+ it approaches the design's 872px via the padded content column.
const SECTION_CLASS =
  "relative overflow-hidden z-[1] -mt-[68px] xl:-mt-[81px]";

// ─── Decor layers (back → front, Figma paint order) ───────────────────

// Aurora raster (Figma #1729:1872) — organic violet streaks, 14KB webp.
const AURORA_CLASS = "absolute inset-0 z-0 pointer-events-none select-none";

// Giant ghost wordmark (Figma #1729:1873): the logo glyphs at 145% frame
// width, y≈36%, #090909 at 20% — reuses LOGO_PATHS (viewBox 129×9.06).
const WORDMARK_CLASS =
  "hidden lg:block absolute z-[1] pointer-events-none opacity-20 " +
  "left-[-41.1%] top-[35.8%] w-[145%]";

// Blur-ellipse stand-ins — STATIC radial gradients sized to the blurred
// footprint (node box + Figma blur bleed), job-#135 rule. Three dark
// vignettes (#080712) carve darkness out of the aurora; one violet glow
// (#642DBA) feeds the right edge / header glass. Percentages are the
// ellipse CENTERS mapped to the 1920×872 frame, translated -50%/-50%.
const ELLIPSE_BASE =
  "absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full";
const E823_CLASS = // dark, behind content column — center (935,556), footprint ≈2081×2018
  `${ELLIPSE_BASE} z-[2] left-[48.7%] top-[63.8%] w-[108%] aspect-[2081/2018] bg-[radial-gradient(50%_50%_at_50%_50%,#080712_0%,transparent_70%)]`;
const E825_CLASS = // dark, upper-left of devices — center (778,277), footprint ≈727×685
  `${ELLIPSE_BASE} z-[2] left-[40.5%] top-[31.8%] w-[37.9%] aspect-[727/685] bg-[radial-gradient(50%_50%_at_50%_50%,#080712_0%,transparent_70%)]`;
const E821_CLASS = // violet glow, right edge — center (2118,446), footprint ≈1291×1252
  `${ELLIPSE_BASE} z-[2] left-[110.3%] top-[51.1%] w-[67.2%] aspect-[1291/1252] bg-[radial-gradient(50%_50%_at_50%_50%,#642DBA_0%,transparent_70%)]`;
const E824_CLASS = // dark, OVER the devices' lower half — center (1341,874), footprint ≈1071×830
  `${ELLIPSE_BASE} z-[4] left-[69.8%] top-[100.3%] w-[55.8%] aspect-[1071/830] bg-[radial-gradient(50%_50%_at_50%_50%,#080712_0%,transparent_70%)]`;

// Wireframe globe (Figma #1729:1904) at (1365,224) 670×670.
const GLOBE_CLASS =
  "hidden md:block absolute z-[2] pointer-events-none select-none " +
  "left-[71.1%] top-[25.7%] w-[34.9%] max-w-[670px]";

// Device collage (composed webp, Figma #1729:1908+1909): canvas maps to
// frame box (601,340)-(1982,872). In flow below xl; absolute at xl+,
// bottom-anchored (the collage is pre-clipped at the hero fold).
const DEVICES_WRAP_CLASS =
  "relative z-[3] mt-8 -mb-6 mx-auto w-full max-w-[720px] px-2 " +
  "xl:absolute xl:mt-0 xl:mb-0 xl:px-0 xl:max-w-none xl:w-[71.9%] xl:left-[31.3%] xl:bottom-0";
const DEVICES_IMG_CLASS =
  "w-full h-auto [filter:drop-shadow(0_34px_44px_oklch(0_0_0_/_0.5))]";

// ─── Content column (Figma #1729:1977: x240 y144, 635 wide) ───────────

const CONTAINER_CLASS = "relative z-10 max-w-container mx-auto px-6 sm:px-8 lg:px-12";
// Top padding clears the floating header (68/81px) + the design's 63px gap
// (144-81). Bottom padding leaves room for the absolute stats bar at xl+.
const CONTENT_CLASS =
  "relative pt-[100px] sm:pt-[120px] xl:pt-[144px] pb-10 xl:pb-[220px] 2xl:pb-[153px] " +
  "max-w-[635px]";

// H1 — Actay Wide Bold 64/61.44, tracking −2.24px, uppercase (Figma
// #1729:1981); gradient tail = 3-stop violet (#1729:1983).
const H1_CLASS =
  "m-0 mb-6 xl:mb-[50px] font-actay font-bold uppercase text-white " +
  "text-[38px] leading-[0.96] tracking-[-0.035em] sm:text-[48px] xl:text-[56px] 2xl:text-[64px]";
const H1_GRADIENT_CLASS =
  "block w-fit bg-clip-text text-transparent [-webkit-text-fill-color:transparent] " +
  "bg-[linear-gradient(180deg,#7C54CD_19.6%,#4D3481_58.3%,#1E1335_97%)]";

// Sub (Figma #1729:1984): Montserrat 14/22.4, white, 377px cap.
const SUB_CLASS =
  "m-0 mb-[34px] font-nav text-[14px] leading-[1.6] text-white max-w-[377px] text-pretty";

// Divider (Figma #1729:1985): 457px hairline.
const DIVIDER_CLASS = "w-[457px] max-w-full h-px bg-[oklch(1_0_0/0.14)]";

// 2×2 features (Figma #1729:1986: 480 wide, gaps 24/12, pt 19).
const FEATURES_CLASS =
  "grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-3 pt-[19px] mb-10 xl:mb-[68px] max-w-[480px]";
const FEAT_CLASS = "flex items-center gap-3";
// 26px circle: violet 12% fill + violet 20% 1px border (Figma #1729:1988).
const FEAT_CHECK_CLASS =
  "w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 " +
  "bg-[rgba(124,84,205,0.12)] border border-[rgba(124,84,205,0.2)] text-[#a58bec] " +
  "[&_svg]:w-3.5 [&_svg]:h-3.5";
const FEAT_LABEL_CLASS =
  "font-sans font-semibold text-[13px] leading-[1.2] text-[#f5f4f8]";
const FEAT_SUB_CLASS =
  "font-sans text-[11px] leading-[1.5] tracking-[0.22px] text-[#727077] mt-px";

const CTA_ROW_CLASS = "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center";

// ─── Overlays ─────────────────────────────────────────────────────────

// Stats bar (Figma #1729:2034: 733×102 at x947 y719 — right edge on the
// container's right, 51px above the fold; overlaps the MacBook). Glass:
// white 2% + white 8% border + blur 4 (small surface — allowed everywhere).
const STATS_CLASS =
  "relative z-20 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-[18px] px-6 py-5 " +
  "bg-[oklch(1_0_0/0.02)] border border-[oklch(1_0_0/0.08)] backdrop-blur-[4px] " +
  "xl:absolute xl:mt-0 xl:right-0 xl:bottom-[51px] xl:w-[733px] xl:max-w-none xl:h-[102px] xl:flex-nowrap xl:px-[25px] xl:gap-0 xl:justify-between";
const STAT_CLASS = "flex flex-col gap-1.5 min-w-0";
const STAT_NUM_CLASS =
  "font-sans font-bold text-[22px] xl:text-[28px] leading-none tracking-[-0.84px] text-[#f5f4f8]";
const STAT_LBL_CLASS =
  "font-sans text-[10px] leading-[13px] tracking-[0.8px] uppercase text-[#727077]";
const STAT_DIV_CLASS = "hidden xl:block w-px h-10 bg-[oklch(1_0_0/0.08)] shrink-0";

// Portfolio teaser (Figma #1729:2058/2064: 253×257 at x1427 y144 — right
// edge on the container's right). White-10% glass card linking to the
// portfolio; media = CMS case cover (decision 6), phone-framed.
const PORTFOLIO_CARD_CLASS =
  "hidden xl:block absolute z-20 right-0 top-[144px] w-[253px] h-[257px] rounded-[13px] " +
  "bg-[oklch(1_0_0/0.10)] backdrop-blur-[8px] overflow-hidden no-underline " +
  "transition-transform duration-200 hover:-translate-y-1 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";
const PORTFOLIO_TITLE_CLASS =
  "absolute left-[26px] top-[26px] w-[181px] font-actay font-bold uppercase text-white " +
  "text-[19.4px] leading-[0.857] z-[2]";
// Phone-framed cover: rounded frame tilted like the Figma iPhone 40
// (218×273 at (74,87), bleeding past the card's bottom-right).
const PORTFOLIO_PHONE_CLASS =
  "absolute left-[74px] top-[87px] w-[218px] h-[273px] rounded-[24px] overflow-hidden " +
  "rotate-[8deg] border border-[oklch(1_0_0/0.25)] bg-[#121212] " +
  "[&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:object-top";
const PORTFOLIO_ARROW_CLASS = "absolute left-[24px] top-[175px] size-[57px] z-[2]";

// Vertical "Cases" label (Figma #1729:2065 at x1341 y144: dot + rotated text).
const CASES_TAG_CLASS =
  "hidden xl:flex absolute z-20 right-[286px] top-[144px] flex-col items-center gap-3.5";
const CASES_DOT_CLASS =
  "w-2.5 h-2.5 rounded-full bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]";
const CASES_TEXT_CLASS =
  "[writing-mode:vertical-rl] font-nav text-[11px] tracking-[1.32px] uppercase text-white";

const ARROW_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SECONDARY_ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function FeatureChip({ label, sub }: { label: string; sub: string }) {
  return (
    <div className={FEAT_CLASS}>
      <div className={FEAT_CHECK_CLASS}>
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className={FEAT_LABEL_CLASS}>{label}</div>
        <div className={FEAT_SUB_CLASS}>{sub}</div>
      </div>
    </div>
  );
}

/** Ghost wordmark — LOGO_PATHS scaled to the hero band (see audit §1.1). */
function GhostWordmark() {
  return (
    <svg viewBox="0 0 129 9.06" className={WORDMARK_CLASS} aria-hidden="true" focusable="false">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill="#090909" />
      ))}
    </svg>
  );
}

export type HomeHeroProps = {
  /** White H1 lines (Figma #1729:1982). */
  h1White: React.ReactNode;
  /** Gradient H1 tail, e.g. "leads 24/7" (Figma #1729:1983). */
  h1Gradient: string;
  sub: React.ReactNode;
  features: { label: string; sub: string }[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: { num: string; lbl: React.ReactNode }[];
  portfolio: {
    title: string;
    tag: string;
    href: string;
    image: SanityImage | null;
    imageAlt: string;
  };
  deviceAlt: string;
};

export function HomeHero({
  h1White,
  h1Gradient,
  sub,
  features,
  ctaPrimary,
  ctaSecondary,
  stats,
  portfolio,
  deviceAlt,
}: HomeHeroProps) {
  return (
    <>
      <div className={PAGE_BG_CLASS} />
      <div className="hero-grain" />

      <section className={SECTION_CLASS}>
        {/* Decor stack (Figma paint order) */}
        <AppImage
          src="/hero/aurora.webp"
          alt=""
          aria-hidden
          width={1672}
          height={941}
          quality={75}
          loading="eager"
          sizes="100vw"
          className={AURORA_CLASS + " h-full w-full object-cover"}
        />
        <GhostWordmark />
        <div className={E823_CLASS} aria-hidden="true" />
        <div className={E825_CLASS} aria-hidden="true" />
        <div className={E821_CLASS} aria-hidden="true" />
        <AppImage
          src="/hero/globe.svg"
          alt=""
          aria-hidden
          width={670}
          height={670}
          sizes="(max-width: 1100px) 0px, 35vw"
          className={GLOBE_CLASS}
        />

        {/* Device collage — in flow below xl, absolute bottom-right at xl+ */}
        <div className={DEVICES_WRAP_CLASS}>
          <AppImage
            src="/hero/devices.webp"
            alt={deviceAlt}
            width={1381}
            height={532}
            priority
            fetchPriority="high"
            quality={80}
            sizes="(max-width: 1100px) 96vw, 72vw"
            className={DEVICES_IMG_CLASS}
          />
        </div>
        <div className={E824_CLASS} aria-hidden="true" />

        <div className={CONTAINER_CLASS}>
          <div className={CONTENT_CLASS}>
            <h1 className={H1_CLASS} data-speakable="hero-title">
              {h1White}
              <span className={H1_GRADIENT_CLASS}>{h1Gradient}</span>
            </h1>

            <p className={SUB_CLASS} data-speakable="hero-description">
              {sub}
            </p>

            <div className={DIVIDER_CLASS} aria-hidden="true" />

            <div className={FEATURES_CLASS}>
              {features.map((f) => (
                <FeatureChip key={f.label} label={f.label} sub={f.sub} />
              ))}
            </div>

            <div className={CTA_ROW_CLASS}>
              <Link href={ctaPrimary.href} className={btnClass("violet")}>
                <span>{ctaPrimary.label}</span>
                {ARROW_ICON}
              </Link>
              <Link href={ctaSecondary.href} className={btnClass("whisper")}>
                <span>{ctaSecondary.label}</span>
                {SECONDARY_ARROW_ICON}
              </Link>
            </div>
          </div>

          {/* Stats bar — glass overlay across the MacBook at xl+ */}
          <div className={STATS_CLASS}>
            {stats.map((s, i) => (
              <span key={i} className="contents">
                {i > 0 && <span className={STAT_DIV_CLASS} />}
                <div className={STAT_CLASS}>
                  <div className={STAT_NUM_CLASS}>{s.num}</div>
                  <div className={STAT_LBL_CLASS}>{s.lbl}</div>
                </div>
              </span>
            ))}
          </div>

          {/* Portfolio teaser + vertical Cases tag */}
          <Link href={portfolio.href} className={PORTFOLIO_CARD_CLASS}>
            <span className={PORTFOLIO_TITLE_CLASS}>{portfolio.title}</span>
            <span className={PORTFOLIO_PHONE_CLASS} aria-hidden="true">
              {portfolio.image ? (
                <SanityImg
                  image={portfolio.image}
                  alt=""
                  sizes="218px"
                />
              ) : null}
            </span>
            <CtaArrow className={PORTFOLIO_ARROW_CLASS} />
            <span className="sr-only">{portfolio.imageAlt}</span>
          </Link>
          <div className={CASES_TAG_CLASS} aria-hidden="true">
            <span className={CASES_DOT_CLASS} />
            <span className={CASES_TEXT_CLASS}>{portfolio.tag}</span>
          </div>
        </div>
      </section>
    </>
  );
}
