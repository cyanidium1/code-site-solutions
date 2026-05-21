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
    metadata { lqip, dimensions }
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
  value,
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

export const CASE_STUDIES_QUERY = /* groq */ `
*[_type == "caseStudy" && status == "published" && defined(slug.current)]{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  client,
  region ${LOCALIZED_STRING},
  year,
  "industrySlug": industry->slug.current,
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  status,
  featured,
  metricsLine ${LOCALIZED_STRING},
  hero{
    metrics[] ${METRIC}
  }
} | order(featured desc, year desc, _createdAt desc)
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
  stack,
  metricsLine ${LOCALIZED_STRING},
  youtubeId,
  "coverImage": coverImage ${IMAGE_WITH_ALT},
  seo ${SEO_FIELDS},
  hero{
    eyebrow ${LOCALIZED_STRING},
    heading ${LOCALIZED_TEXT},
    subheading ${LOCALIZED_TEXT},
    metrics[] ${METRIC}
  },
  sections[]{
    _type,
    _key,
    ...,
    image ${IMAGE_WITH_ALT},
    images[]{
      ...,
      "asset": image.asset->{ _id, url, metadata { lqip, dimensions } },
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
  category,
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
  category,
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
        metadata { lqip, dimensions }
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
        metadata { lqip, dimensions }
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
  category,
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
        metadata { lqip, dimensions }
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
        metadata { lqip, dimensions }
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
        metadata { lqip, dimensions }
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
  order
} | order(order asc, _createdAt desc)
`;
