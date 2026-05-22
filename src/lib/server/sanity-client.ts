import "server-only";

import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const useCdn =
  (process.env.NEXT_PUBLIC_SANITY_USE_CDN ?? "true").toLowerCase() !== "false";
// Server-only token. Required when the dataset is private. Prefer a
// read-only token (SANITY_API_READ_TOKEN); falls back to SANITY_API_TOKEN.
const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

export const SANITY_PROJECT_ID = projectId;
export const SANITY_DATASET = dataset;
export const SANITY_API_VERSION = apiVersion;

// When env vars aren't configured (e.g. preview builds without Sanity wired
// up), export a null client instead of throwing at module load. Callers in
// `fetch.ts` surface a clear runtime error so individual data fetches fail
// gracefully without taking down the whole build.
export const sanityClient: SanityClient | null =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        // Token reads bypass the CDN (CDN is unauthenticated), so disable it
        // when a token is present.
        useCdn: token ? false : useCdn,
        perspective: "published",
        token,
      })
    : null;
