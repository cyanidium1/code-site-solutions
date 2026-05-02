import { sanityClient } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  /** Seconds before the cached response is revalidated. Defaults to 60. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation. */
  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params,
  revalidate = 60,
  tags,
}: SanityFetchOptions): Promise<T> {
  if (!sanityClient) {
    throw new Error(
      "Sanity client is not configured: missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET",
    );
  }
  return sanityClient.fetch<T>(query, params ?? {}, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}
