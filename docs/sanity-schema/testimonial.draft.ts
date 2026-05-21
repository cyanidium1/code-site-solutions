/**
 * DRAFT — copy this file into the admin (Sanity studio) repo at
 *   schemas/testimonial.ts
 * and register it in the studio's schema index (alongside caseStudy,
 * blogPost, industryPage, etc.).
 *
 * References these existing studio types:
 *   - localizedString          (object: { uk, ru, en } string)
 *   - localizedText            (object: { uk, ru, en } text)
 *   - imageWithLocalizedAlt    (object: { image, alt: localizedString })
 *   - caseStudy                (document type)
 *
 * Mirrors the frontend type `Testimonial` in src/lib/sanity/types.ts
 * and the GROQ query `HOMEPAGE_TESTIMONIALS_QUERY` in
 * src/lib/sanity/queries.ts. Keep all three in sync when fields change.
 */

import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role / company",
      type: "localizedString",
    }),
    defineField({
      name: "authorInitials",
      title: "Author initials (avatar fallback)",
      type: "string",
      validation: (r) => r.max(3),
      description:
        "Up to 3 letters. If left blank, the frontend derives initials from authorName.",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "localizedText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mockupLeft",
      title: "Phone mockup (left on desktop, above quote on mobile)",
      type: "imageWithLocalizedAlt",
    }),
    defineField({
      name: "mockupRight",
      title: "Laptop mockup (right on desktop, hidden on mobile)",
      type: "imageWithLocalizedAlt",
    }),
    defineField({
      name: "caseRef",
      title: "Linked case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
      description:
        "Optional. Adds a 'See the full case study' button below the quote.",
    }),
    defineField({
      name: "caseLabel",
      title: "Case-study link label",
      type: "localizedString",
      description:
        "Optional. Falls back to a localized default ('See the full case study' / 'Подивитись повний кейс') if empty.",
    }),
    defineField({
      name: "featured",
      title: "Featured (show on homepage)",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to keep the doc in the collection but exclude from the homepage slider.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first. Ties broken by most-recently-created.",
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "authorRole.en",
      media: "mockupLeft.image",
    },
  },
  orderings: [
    {
      title: "Order, ascending",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Most recent",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
