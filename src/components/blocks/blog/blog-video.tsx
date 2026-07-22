"use client";

import { useState } from "react";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";

/**
 * Click-to-load YouTube facade for blog posts. Renders a static poster
 * (i.ytimg.com) with a play button; the youtube-nocookie iframe — and all
 * of Google's player JS — loads only after the reader clicks, so the
 * embed costs the article nothing at LCP/TBT time and nothing reaches
 * Google before an explicit interaction.
 */
export function BlogVideo({
  youtubeId,
  title,
  caption,
}: {
  youtubeId: string;
  title?: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // maxresdefault (1280×720) is not generated for every video — fall back
  // to the always-present hqdefault (480×360; its 4:3 letterbox bars are
  // cropped away by object-cover in the 16:9 frame).
  const [posterRes, setPosterRes] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault",
  );
  const label = title ?? "YouTube video";

  return (
    <figure className="blog-video">
      <div className="blog-video-frame">
        {playing ? (
          <iframe
            className="blog-video-iframe"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="blog-video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`▶ ${label}`}
          >
            <AppImage
              src={`https://i.ytimg.com/vi/${youtubeId}/${posterRes}.jpg`}
              alt=""
              fill
              sizes={IMG_SIZES.prose}
              className="object-cover"
              onError={() => setPosterRes("hqdefault")}
            />
            <span className="blog-video-play" aria-hidden="true">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path d="M1.5 2.1v15.8c0 1.2 1.3 1.9 2.3 1.3l13-7.9c1-.6 1-2 0-2.6l-13-7.9c-1-.6-2.3.1-2.3 1.3z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
