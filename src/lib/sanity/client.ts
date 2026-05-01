import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const useCdn =
  (process.env.NEXT_PUBLIC_SANITY_USE_CDN ?? "true").toLowerCase() !== "false";
// Server-only token. Required when the dataset is private. Prefer a
// read-only token (SANITY_API_READ_TOKEN); falls back to SANITY_API_TOKEN.
const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET env vars",
  );
}

export const SANITY_PROJECT_ID = projectId;
export const SANITY_DATASET = dataset;
export const SANITY_API_VERSION = apiVersion;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Token reads bypass the CDN (CDN is unauthenticated), so disable it when
  // a token is present.
  useCdn: token ? false : useCdn,
  perspective: "published",
  token,
});
