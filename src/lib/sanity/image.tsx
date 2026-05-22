import Image from "next/image";
import type { SanityImage as SanityImageType } from "@/types/sanity";

type SanityImgProps = {
  image: SanityImageType | null | undefined;
  alt?: string;
} & Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "width" | "height">;

export function SanityImg({ image, alt = "", fill, ...props }: SanityImgProps) {
  if (!image?.asset?.url) return null;
  const { asset } = image;

  if (fill) {
    return (
      <Image
        src={asset.url}
        alt={alt}
        fill
        placeholder={asset.metadata?.lqip ? "blur" : undefined}
        blurDataURL={asset.metadata?.lqip}
        {...props}
      />
    );
  }

  const w = asset.metadata?.dimensions?.width ?? 800;
  const h = asset.metadata?.dimensions?.height ?? 600;
  return (
    <Image
      src={asset.url}
      alt={alt}
      width={w}
      height={h}
      placeholder={asset.metadata?.lqip ? "blur" : undefined}
      blurDataURL={asset.metadata?.lqip}
      {...props}
    />
  );
}
