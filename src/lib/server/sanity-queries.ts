import "server-only";

/**
 * GROQ queries — mirror of the queries authored in the admin repo
 * (`code-site-solutions-admin/queries/*`).
 *
 * Keep the two copies in sync. Do not extend these queries with frontend-only
 * concerns; if the schema changes, update the admin queries first, then mirror
 * here.
 */

const LOCALIZED_STRING = /* groq */ `{
  uk,
  ru,
  en
}`;

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
 * Lightweight blog-post projection for related-posts cards.
 *
 * Sprint 2A made blogPost.title / .excerpt flat strings (not the
 * localized {uk,en,ru} objects used elsewhere on the site), so the
 * earlier LOCALIZED_STRING / LOCALIZED_TEXT projections were stale —
 * they'd surface objects with empty fields at runtime. Now flat.
 *
 * Sprint 2BC adds optional slugEn for EN-only routing (post resolver
 * uses it to swap UA→EN slugs in related-cards on /en/blog/[slug]).
 */
const BLOG_POST_REF = /* groq */ `{
  _id,
  "slug": slug.current,
  "slugEn": slugEn.current,
  title,
  publishedAt,
  excerpt,
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

/**
 * Lightweight listing projection for /blog and related-articles cards.
 * Sprint 2BC: EN shadow fields (titleEn / eyebrowEn / ledeEn / slugEn)
 * are projected alongside the UA originals. The caller (listing or
 * related-card renderer) picks the right field by locale; if the EN
 * field is missing the post is omitted from the EN listing entirely.
 */
const BLOG_POST_LIST_ITEM = /* groq */ `{
  _id,
  "slug": slug.current,
  "slugEn": slugEn.current,
  title,
  titleEn,
  eyebrow,
  eyebrowEn,
  lede,
  ledeEn,
  "category": category->{ "slug": slug.current, name ${LOCALIZED_STRING}, color },
  publishedAt,
  readingTimeMinutes,
  coverImage{ src, alt }
}`;

export const BLOG_POSTS_LIST_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && defined(slug.current)]
${BLOG_POST_LIST_ITEM}
| order(publishedAt desc, _createdAt desc)
`;

/**
 * Per-slug lookup used by related-articles resolution. Accepts a $slugs
 * array — empty array returns []. Order is not guaranteed; caller should
 * re-order against the requested slugs.
 */
export const BLOG_POSTS_BY_SLUGS_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && slug.current in $slugs]
${BLOG_POST_LIST_ITEM}
`;

/**
 * Full blog post payload. Parameter: $slug.
 * Mirrors admin/queries/blogPost.ts but with Sprint 2A's extended schema
 * (flat author object, faq items, related slugs, custom body blocks).
 */
export const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "slugEn": slugEn.current,
  title,
  titleEn,
  metaTitle,
  metaTitleEn,
  metaDescription,
  metaDescriptionEn,
  eyebrow,
  eyebrowEn,
  lede,
  ledeEn,
  "category": category->{ "slug": slug.current, name ${LOCALIZED_STRING}, color },
  tags,
  publishedAt,
  updatedAt,
  readingTimeMinutes,
  coverImage{ src, alt },
  "ogImage": ogImage.asset->{ _id, url, metadata { dimensions } },
  author{ name, role, photoUrl, bio },
  body[]{
    ...,
    // blogImage — resolve asset once
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions, isOpaque }
      },
      hotspot,
      crop,
      alt,
      caption
    }
  },
  bodyEn[]{
    ...,
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions, isOpaque }
      },
      hotspot,
      crop,
      alt,
      caption
    }
  },
  faq[]{ _key, question, answer },
  faqEn[]{ _key, question, answer },
  relatedPostSlugs
}
`;

/**
 * Sprint 2BC EN-locale lookup. Matches on `slugEn.current` (the
 * EN-only slug field). Returns the same shape as the UA query so
 * the post renderer can render either locale uniformly. If the doc
 * has no EN content at all, the field-level guards in the post page
 * trigger a 404.
 */
export const BLOG_POST_BY_EN_SLUG_QUERY = /* groq */ `
*[_type == "blogPost" && status == "published" && slugEn.current == $slug][0]{
  _id,
  "slug": slug.current,
  "slugEn": slugEn.current,
  title,
  titleEn,
  metaTitle,
  metaTitleEn,
  metaDescription,
  metaDescriptionEn,
  eyebrow,
  eyebrowEn,
  lede,
  ledeEn,
  "category": category->{ "slug": slug.current, name ${LOCALIZED_STRING}, color },
  tags,
  publishedAt,
  updatedAt,
  readingTimeMinutes,
  coverImage{ src, alt },
  "ogImage": ogImage.asset->{ _id, url, metadata { dimensions } },
  author{ name, role, photoUrl, bio },
  body[]{
    ...,
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions, isOpaque }
      },
      hotspot,
      crop,
      alt,
      caption
    }
  },
  bodyEn[]{
    ...,
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions, isOpaque }
      },
      hotspot,
      crop,
      alt,
      caption
    }
  },
  faq[]{ _key, question, answer },
  faqEn[]{ _key, question, answer },
  relatedPostSlugs
}
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
    // faqBlock — pull EN-shadow rich text
    items[]{
      ...,
      answer,
      answerEn
    },
    // reasonsBlock — pull EN-shadow rich text on each reason
    reasons[]{
      ...,
      text,
      textEn
    },
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
    percent,
    "previews": previews[]{ _key, src, caption { uk, ru, en } }
  },
  "languageOptions": languages[]{ _key, optionKey, label { uk, ru, en }, percent },
  "timelineOptions": timeline[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price },
  "contentOptions": contentOptions[]{ _key, optionKey, label { uk, ru, en }, price },
  "cmsOptions": cmsUpgrades[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "seoOptions": seoOptions[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "featureOptions": features[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included, featureGroup }
}`;
