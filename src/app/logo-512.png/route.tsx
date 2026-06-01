import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/shared/brand-mark";

// Stable square raster referenced by the Organization `publisher.logo`
// JSON-LD on blog posts. Prerendered at build so the URL is a plain
// cacheable asset rather than a per-request render.
export const dynamic = "force-static";
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(<BrandMark size={512} />, {
    width: 512,
    height: 512,
  });
}
