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

const BLOG_POST_REF = /* groq */ `{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  publishedAt,
  excerpt ${LOCALIZED_TEXT},
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

export const INDUSTRY_PAGES_QUERY = /* groq */ `
*[_type == "industryPage" && status == "published" && defined(slug.current)]{
  _id,
  "slug": slug.current,
  title ${LOCALIZED_STRING},
  status,
  order
} | order(order asc, _createdAt asc)
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
