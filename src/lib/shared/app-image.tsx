// eslint-disable-next-line no-restricted-imports -- the one sanctioned next/image entry point (docs/images.md)
import Image from "next/image";

/**
 * Canonical component for images served from /public and non-Sanity remotes
 * (Unsplash). Thin wrapper over next/image — the Vercel optimizer resizes and
 * AVIF/WebP-encodes. The only difference vs next/image: `sizes` is mandatory,
 * because every local-image finding in the 2026-06 image audit traced back to
 * a missing `sizes` (next/image then assumes 100vw and over-fetches).
 *
 * Sanity-hosted content imagery belongs in <SanityImg> instead — it must not
 * round-trip through /_next/image.
 */
type AppImageProps = Omit<React.ComponentProps<typeof Image>, "sizes"> & {
  /** REQUIRED: rendered-width hints. Use IMG_SIZES presets where one fits. */
  sizes: string;
};

export function AppImage(props: AppImageProps) {
  return <Image {...props} />;
}
