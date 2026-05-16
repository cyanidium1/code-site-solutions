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

// blogPost reference projection — used by relatedPosts on industryPage
// and caseStudy. Sprint 2A made title/lede/coverImage plain (non-localized)
// strings + {src,alt}. This projection mirrors that. Sprint 2BC adds the
// titleEn / ledeEn shadows so the consumer can pick by locale.
const BLOG_POST_REF = /* groq */ `{
  _id,
  "slug": slug.current,
  "slugEn": slugEn.current,
  title,
  titleEn,
  publishedAt,
  lede,
  ledeEn,
  coverImage{ src, alt, altEn },
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
 * Returns simple (non-localized) strings — blog posts are UA-only for Sprint 2A.
 * EN translations land in Sprint 5.
 */
const BLOG_POST_LIST_ITEM = /* groq */ `{
  _id,
  "slug": slug.current,
  title,
  eyebrow,
  lede,
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
 * EN listing — only posts that have BOTH a published EN slug AND an EN
 * title (so an empty titleEn doesn't surface a half-translated post).
 * Projected fields prefer the EN variant, fallback to UA where missing
 * (UA field used as the source of truth for date / category / tags etc.).
 */
const BLOG_POST_LIST_ITEM_EN = /* groq */ `{
  _id,
  "slug": slugEn.current,
  "title": coalesce(titleEn, title),
  "eyebrow": coalesce(eyebrowEn, eyebrow),
  "lede": coalesce(ledeEn, lede),
  category,
  publishedAt,
  readingTimeMinutes,
  "coverImage": {
    "src": coverImage.src,
    "alt": coalesce(coverImage.altEn, coverImage.alt)
  }
}`;

export const BLOG_POSTS_LIST_QUERY_EN = /* groq */ `
*[_type == "blogPost" && status == "published" && defined(slugEn.current) && defined(titleEn)]
${BLOG_POST_LIST_ITEM_EN}
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
 * EN related-by-slug resolver. Accepts UA $slugs (the source of truth on
 * `relatedPostSlugs`) and projects EN fields. Result: only items whose
 * EN slug is published get returned — partially-translated posts are
 * skipped on the EN side.
 */
export const BLOG_POSTS_BY_SLUGS_QUERY_EN = /* groq */ `
*[_type == "blogPost" && status == "published" && slug.current in $slugs && defined(slugEn.current) && defined(titleEn)]
${BLOG_POST_LIST_ITEM_EN}
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
  "alternateSlug": slugEn.current,
  title,
  metaTitle,
  metaDescription,
  eyebrow,
  lede,
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
  faq[]{ _key, question, answer },
  relatedPostSlugs
}
`;

/**
 * EN post fetch. Match by slugEn (separate from UA per Sprint 2BC).
 * Projects EN-preferred fields with coalesce() fallback to UA so a
 * partially-translated post still renders, falling back to UA blocks
 * where the EN field is empty.
 */
export const BLOG_POST_BY_SLUG_QUERY_EN = /* groq */ `
*[_type == "blogPost" && status == "published" && slugEn.current == $slug][0]{
  _id,
  "slug": slugEn.current,
  "alternateSlug": slug.current,
  "title": coalesce(titleEn, title),
  "metaTitle": coalesce(metaTitleEn, metaTitle),
  "metaDescription": coalesce(metaDescriptionEn, metaDescription),
  "eyebrow": coalesce(eyebrowEn, eyebrow),
  "lede": coalesce(ledeEn, lede),
  category,
  tags,
  publishedAt,
  updatedAt,
  readingTimeMinutes,
  "coverImage": {
    "src": coverImage.src,
    "alt": coalesce(coverImage.altEn, coverImage.alt)
  },
  "ogImage": ogImage.asset->{ _id, url, metadata { dimensions } },
  author{ name, role, photoUrl, bio },
  "body": coalesce(bodyEn[]{
    ...,
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot,
      crop,
      alt,
      caption
    }
  }, body[]{
    ...,
    _type == "blogImage" => {
      _type,
      _key,
      "asset": asset->{ _id, url, metadata { lqip, dimensions } },
      hotspot,
      crop,
      alt,
      caption
    }
  }),
  "faq": coalesce(faqEn[]{ _key, question, answer }, faq[]{ _key, question, answer }),
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
