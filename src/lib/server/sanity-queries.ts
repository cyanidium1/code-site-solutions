import "server-only";

import { LOCALES } from "@/constants/locales";

/**
 * GROQ queries — mirror of the queries authored in the admin repo
 * (`code-site-solutions-admin/queries/*`).
 *
 * Keep the two copies in sync. Do not extend these queries with frontend-only
 * concerns; if the schema changes, update the admin queries first, then mirror
 * here.
 */

const LOCALIZED_STRING = /* groq */ `{ ${LOCALES.join(", ")} }`;

const LOCALIZED_TEXT = LOCALIZED_STRING;

// Used as a projection on an `imageWithLocalizedAlt` field. The wrapper
// shape is `{ image: <actual image>, alt: <localizedString> }`, so inside
// the projection scope we reach into `image.asset/hotspot/crop`. Frontend
// flattens these into the `SanityImage` shape `{ asset, hotspot, crop, alt }`.
const IMAGE_WITH_ALT = /* groq */ `{
  "asset": image.asset->{
    _id,
    url,
    metadata { lqip, dimensions, isOpaque }
  },
  "hotspot": image.hotspot,
  "crop": image.crop,
  alt ${LOCALIZED_STRING}
}`;

const SEO_FIELDS = /* groq */ `{
  title ${LOCALIZED_STRING},
  description ${LOCALIZED_TEXT},
  "ogImage": ogImage.asset->{ _id, url, metadata { dimensions } }
}`;

const METRIC = /* groq */ `{
  _key,
  value ${LOCALIZED_STRING},
  label ${LOCALIZED_STRING}
}`;

const PRICING_TIER = /* groq */ `{
  _key,
  title ${LOCALIZED_STRING},
  price ${LOCALIZED_STRING},
  weeks ${LOCALIZED_STRING},
  isPopular,
  popularLabel ${LOCALIZED_STRING},
  includesHeading ${LOCALIZED_STRING},
  includes[] ${LOCALIZED_STRING},
  excludesHeading ${LOCALIZED_STRING},
  excludes[] ${LOCALIZED_STRING},
  ctaLabel ${LOCALIZED_STRING},
  ctaGhost
}`;

/**
 * Lightweight blog-post projection for related-posts cards. Localized
 * fields (slugs/title/lede) pass through whole; renderers pick per locale
 * via `pickLocalized` / `loc`.
 */
const BLOG_POST_REF = /* groq */ `{
  _id,
  slugs,
  title,
  lede,
  publishedAt,
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  status
}`;

const CASE_STUDY_REF = /* groq */ `{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  client,
  region ${LOCALIZED_STRING},
  year,
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  status,
  featured
}`;

/**
 * Card-level projection used wherever a list of caseStudy refs is rendered
 * (/portfolio listing, homepage Cases section, homepage curation). Mirrors
 * `CaseStudyRef` in `types/sanity.ts`. Keep in sync with
 * `Sanity/queries/fragments.ts::CASE_STUDY_LISTING_PROJECTION`.
 */
const CASE_STUDY_LISTING_PROJECTION = /* groq */ `{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  client,
  region ${LOCALIZED_STRING},
  "country": country->{ "slug": slug.current, name ${LOCALIZED_STRING} },
  year,
  "budgetBucket": budgetBucket->{ "slug": slug.current, name ${LOCALIZED_STRING} },
  "industrySlug": industry->slug.current,
  "industry": industry->{
    _id,
    "slug": slug.current,
    title ${LOCALIZED_STRING}
  },
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  status,
  featured,
  metricsLine ${LOCALIZED_STRING}
}`;

export const CASE_STUDIES_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && defined(slug.current)]
  ${CASE_STUDY_LISTING_PROJECTION}
  | order(featured desc, year desc, _createdAt desc)
`;

/** Published case studies with a slug (UA portfolio listing). */
export const CASE_STUDIES_COUNT_QUERY = /* groq */ `
count(*[_type == "caseStudy" && status == "published" && defined(slug.current)])
`;

/**
 * Singleton — homepage curation. Returns 4 arrays of CaseStudyRef shapes.
 * The frontend fetcher (`fetchHomepageCases`) falls back to the top 3 from
 * CASE_STUDIES_QUERY when `default` is empty, and hides any industry pill
 * whose set is empty.
 */
export const HOMEPAGE_CASES_QUERY = /* groq */ `
*[_type == "homepageCases" && _id == "homepageCases"][0]{
  "default":     defaultCases[]->${CASE_STUDY_LISTING_PROJECTION},
  "legal":       legalCases[]->${CASE_STUDY_LISTING_PROJECTION},
  "medicine":    medicineCases[]->${CASE_STUDY_LISTING_PROJECTION},
  "realEstate":  realEstateCases[]->${CASE_STUDY_LISTING_PROJECTION}
}
`;

export const CASE_STUDY_BY_SLUG_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  client,
  "industry": industry->{ _id, "slug": slug.current, title ${LOCALIZED_STRING} },
  region ${LOCALIZED_STRING},
  year,
  date,
  duration ${LOCALIZED_STRING},
  budget,
  "budgetBucket": budgetBucket->{ "slug": slug.current, name ${LOCALIZED_STRING} },
  "country": country->{ "slug": slug.current, name ${LOCALIZED_STRING} },
  stack,
  metricsLine ${LOCALIZED_STRING},
  youtubeId,
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  seo ${SEO_FIELDS},
  hero{
    eyebrow ${LOCALIZED_STRING},
    heading ${LOCALIZED_TEXT},
    subheading ${LOCALIZED_TEXT},
    "heroImage": heroImage ${IMAGE_WITH_ALT},
    link{ label ${LOCALIZED_STRING}, href }
  },
  sections[]{
    _type,
    _key,
    ...,
    image ${IMAGE_WITH_ALT},
    "image2": image2 ${IMAGE_WITH_ALT},
    // richTextBlock / imageTextBlock / faqBlock / reasonsBlock: the spread
    // passes localizedRichText objects (content/body/items[].answer/
    // reasons[].text) through whole; renderers pick per locale.
    images[]{
      ...,
      "asset": image.asset->{ _id, url, metadata { lqip, dimensions, isOpaque } },
      "hotspot": image.hotspot,
      "crop": image.crop
    },
    before{ ..., image ${IMAGE_WITH_ALT} },
    after{ ..., image ${IMAGE_WITH_ALT} }
  },
  "relatedPosts": relatedPosts[]->${BLOG_POST_REF},
  featured
}
`;

export const INDUSTRY_PAGES_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && defined(slug.current)]{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  status,
  order
} | order(order asc, _createdAt asc)
`;

/* ─── Blog post queries ───────────────────────────────────────────────────── */

/** CMS-hosted cover (blogPost.cover, type imageWithLocalizedAlt). */
const BLOG_COVER = /* groq */ `{
  "asset": image.asset->{ _id, url, metadata { lqip, dimensions, isOpaque } },
  "crop": image.crop,
  "hotspot": image.hotspot,
  alt ${LOCALIZED_STRING}
}`;

/**
 * Lightweight listing projection for /blog and related-articles cards.
 * Localized objects (slugs/title/eyebrow/lede) pass through whole; the
 * renderer picks per locale via `pickLocalized`. A post is omitted from a
 * secondary-locale listing when its localized members are missing.
 */
const BLOG_POST_LIST_ITEM = /* groq */ `{
  _id,
  slugs,
  title,
  eyebrow,
  lede,
  "category": category->{ "slug": slug.current, name ${LOCALIZED_STRING}, color },
  publishedAt,
  readingTimeMinutes,
  "cover": cover${BLOG_COVER},
  coverImage{ src, alt, altEn }
}`;

export const BLOG_POSTS_LIST_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && defined(slugs.uk.current)]
${BLOG_POST_LIST_ITEM}
| order(publishedAt desc, _createdAt desc)
`;

/**
 * Per-slug lookup used by related-articles resolution. Accepts a $slugs
 * array — empty array returns []. Order is not guaranteed; caller should
 * re-order against the requested slugs.
 */
export const BLOG_POSTS_BY_SLUGS_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && slugs.uk.current in $slugs]
${BLOG_POST_LIST_ITEM}
`;

/**
 * Per-locale body sub-projection with blogImage asset resolution, generated
 * from LOCALES so a new locale's body member is projected automatically.
 */
const BLOG_BODY_LOCALIZED = `{
${LOCALES.map(
  (l) => `    "${l}": ${l}[]{
      ...,
      _type == "blogImage" => {
        _type,
        _key,
        "asset": asset->{ _id, url, metadata { lqip, dimensions, isOpaque } },
        hotspot,
        crop,
        alt,
        caption
      }
    }`,
).join(",\n")}
  }`;

const BLOG_POST_FULL = /* groq */ `{
  _id,
  slugs,
  title,
  metaTitle,
  metaDescription,
  eyebrow,
  lede,
  "category": category->{ "slug": slug.current, name ${LOCALIZED_STRING}, color },
  tags,
  publishedAt,
  updatedAt,
  readingTimeMinutes,
  "cover": cover${BLOG_COVER},
  coverImage{ src, alt, altEn },
  "ogImage": ogImage.asset->{ _id, url, metadata { dimensions } },
  author{ name, role, photoUrl, bio },
  faqHeading,
  "body": body${BLOG_BODY_LOCALIZED},
  faq[]{ _key, question, answer },
  relatedPostSlugs
}`;

/**
 * Full blog post payload, any locale. Parameters: $slug + $locale — matches
 * on that locale's slug (`slugs[$locale].current`). One query serves every
 * locale's blog [slug] route.
 */
export const BLOG_POST_BY_LOCALE_SLUG_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && slugs[$locale].current == $slug][0]
${BLOG_POST_FULL}
`;


export const INDUSTRY_PAGE_BY_SLUG_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},

  seo ${SEO_FIELDS},

  hero{
    eyebrow ${LOCALIZED_STRING},
    heading ${LOCALIZED_TEXT},
    h1Num,
    h1NumLabel ${LOCALIZED_TEXT},
    lede ${LOCALIZED_TEXT},
    features[] ${LOCALIZED_STRING},
    ctaPrimary ${LOCALIZED_STRING},
    ctaSecondary ${LOCALIZED_STRING},
    stats[] ${METRIC},
    tickerItems[] ${LOCALIZED_STRING},
    deviceTags[]{
      _key,
      kind,
      primary ${LOCALIZED_STRING},
      mini
    },
    deviceMockup ${IMAGE_WITH_ALT}
  },

  sections[]{
    _type,
    _key,
    ...,
    // imageTextBlock — resolve image asset
    image ${IMAGE_WITH_ALT},
    // richTextBlock / imageTextBlock / faqBlock / reasonsBlock: the spread
    // passes localizedRichText objects through whole; renderers pick per
    // locale via pickLocalized.
    // servicesBlock — resolve nested feature image assets
    features[]{
      ...,
      image ${IMAGE_WITH_ALT}
    },
    // servicesBlock — resolve testimonial visual asset
    testimonial{
      ...,
      visual ${IMAGE_WITH_ALT}
    },
    // outcomeBlock — resolve per-row screenshot assets
    benefitRows[]{
      ...,
      image ${IMAGE_WITH_ALT}
    },
    // caseBlock — resolve before/after nested image assets
    before{
      ...,
      image ${IMAGE_WITH_ALT}
    },
    after{
      ...,
      image ${IMAGE_WITH_ALT}
    },
    // mediaGalleryBlock — resolve nested image assets
    images[]{
      ...,
      "asset": image.asset->{
        _id,
        url,
        metadata { lqip, dimensions, isOpaque }
      },
      "hotspot": image.hotspot,
      "crop": image.crop
    },
    // pricingBlock + comparisonBlock — pricing tiers
    tiers[] ${PRICING_TIER}
  },

  "relatedCases": relatedCases[]->${CASE_STUDY_REF},
  "relatedPosts": relatedPosts[]->${BLOG_POST_REF}
}
`;

/* ─── Testimonials ───────────────────────────────────────────────────────── */

/**
 * Homepage testimonial slider feed. Filters to `featured == true` so the
 * studio can park draft / non-public testimonials in the same collection
 * without exposing them on the homepage. Sort: explicit `order` then
 * most-recent first.
 */
export const HOMEPAGE_TESTIMONIALS_QUERY = /* groq */ `
*[_type == "testimonial" && featured == true]{
  _id,
  authorName,
  authorRole ${LOCALIZED_STRING},
  authorInitials,
  linkedinUrl,
  quote ${LOCALIZED_TEXT},
  "mockupLeft": mockupLeft ${IMAGE_WITH_ALT},
  "mockupRight": mockupRight ${IMAGE_WITH_ALT},
  "caseRef": caseRef->{ "slug": slug.current },
  caseLabel ${LOCALIZED_STRING},
  featured,
  order,
  rating,
  reviewDate,
  reviewHeadline ${LOCALIZED_STRING},
  _createdAt
} | order(order asc, _createdAt desc)
`;

/* ─── Pricing plans (homepage + /pricing tier cards) ─────────────────────── */

export const PRICING_PLANS_QUERY = /* groq */ `
*[_type == "pricingPlan"]{
  _id,
  planKey,
  name ${LOCALIZED_STRING},
  priceFrom,
  currency,
  weeks ${LOCALIZED_STRING},
  includesHeading ${LOCALIZED_STRING},
  includes[] ${LOCALIZED_STRING},
  excludesHeading ${LOCALIZED_STRING},
  excludes[] ${LOCALIZED_STRING},
  ctaLabel ${LOCALIZED_STRING},
  ctaHref,
  ctaGhost,
  discountLine ${LOCALIZED_STRING},
  isPopular,
  popularLabel ${LOCALIZED_STRING},
  order
} | order(order asc, _createdAt asc)
`;

export const CALCULATOR_CONFIG_QUERY = /* groq */ `*[_id == "calculatorConfig"][0]{
  "settings": { defaultProjectType, roundStep },
  "projectTypes": projectTypes[]{
    _key, projectKey,
    label { uk, ru, en },
    hint { uk, ru, en },
    basePrice, hasProductComplexity, pages
  },
  "productComplexityOptions": productComplexity[]{
    _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price
  },
  "designOptions": design[]{
    _key, optionKey,
    label { uk, ru, en },
    hint { uk, ru, en },
    percent
  },
  "languageOptions": languages[]{ _key, optionKey, label { uk, ru, en }, percent },
  "timelineOptions": timeline[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price },
  "contentOptions": contentOptions[]{ _key, optionKey, label { uk, ru, en }, price },
  "cmsOptions": cmsUpgrades[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "seoOptions": seoOptions[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "featureOptions": features[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included, featureGroup }
}`;
