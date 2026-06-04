import "server-only";

import { createClient, type SanityClient } from "@sanity/client";

// TEMP OVERRIDE: the Vercel env pinned NEXT_PUBLIC_SANITY_PROJECT_ID to a stale
// project (vh20xg14) that has no content for the current schema, so cases/blog/
// industries rendered empty. Hardcode the correct project until the dashboard
// env is fixed, then revert to the env-driven values below.
//   const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
//   const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const projectId = "4lk0x7o9";
const dataset = "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const useCdn =
  (process.env.NEXT_PUBLIC_SANITY_USE_CDN ?? "true").toLowerCase() !== "false";

export const SANITY_PROJECT_ID = projectId;
export const SANITY_DATASET = dataset;
export const SANITY_API_VERSION = apiVersion;

// When env vars aren't configured (e.g. preview builds without Sanity wired
// up), export a null client instead of throwing at module load. Callers in
// `fetch.ts` surface a clear runtime error so individual data fetches fail
// gracefully without taking down the whole build.
//
// Published content only — no API token. Reads go through the public CDN
// (`NEXT_PUBLIC_SANITY_USE_CDN`, default true). Private datasets are not
// supported in this frontend.
export const sanityClient: SanityClient | null =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn,
        perspective: "published",
      })
    : null;
