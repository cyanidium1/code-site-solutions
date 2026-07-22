import type { ReactNode } from "react";
import Link from "next/link";
import type { BlogBody, BlogBodyBlock, PortableBlock } from "@/types/sanity";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
import { formatLine, renderSpan } from "@/lib/shared/sanity-portable";
import { LeadCtaButton } from "@/components/blocks/lead-modal/lead-cta-button";
import { BlogVideo } from "@/components/blocks/blog/blog-video";

/* ─── Blog-body renderer ─────────────────────────────────────────────────────
   Dispatches custom block types used by blogPost.body:
     tldrBox, ctaCallout, blogTable, blogImage, blogVideo
   Plus the standard portable-text styles + lists.

   Kept separate from sanity-portable.tsx: this module pulls in client
   components (LeadCtaButton, BlogVideo) that only blog pages should ship.

   The wrapper page should set typography via Tailwind on a parent
   container (see /blog/[slug]/page.tsx → .blog-prose).
   ─────────────────────────────────────────────────────────────────────── */

function isPortableBlock(b: BlogBodyBlock): b is PortableBlock {
  return b._type === "block";
}

function renderBlockChildren(
  block: PortableBlock,
  blockKey: string,
): ReactNode[] {
  return block.children.map((span, si) =>
    renderSpan(span, block.markDefs, `${blockKey}-${si}`),
  );
}

function renderBlockBody(block: PortableBlock, key: string): ReactNode {
  const children = renderBlockChildren(block, key);
  const style = block.style ?? "normal";
  if (style === "h2")
    return (
      <h2 key={key} className="blog-h2">
        {children}
      </h2>
    );
  if (style === "h3")
    return (
      <h3 key={key} className="blog-h3">
        {children}
      </h3>
    );
  if (style === "h4")
    return (
      <h4 key={key} className="blog-h4">
        {children}
      </h4>
    );
  if (style === "blockquote")
    return (
      <blockquote key={key} className="blog-blockquote">
        {children}
      </blockquote>
    );
  return (
    <p key={key} className="blog-p">
      {children}
    </p>
  );
}

function renderTldrBox(
  block: Extract<BlogBodyBlock, { _type: "tldrBox" }>,
  key: string,
): ReactNode {
  const items = block.items ?? [];
  return (
    <aside key={key} className="blog-tldr" aria-label={block.title ?? "TL;DR"}>
      <span className="blog-tldr-title">{block.title ?? "За 60 секунд"}</span>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{formatLine(it)}</li>
        ))}
      </ul>
    </aside>
  );
}

function renderCtaCallout(
  block: Extract<BlogBodyBlock, { _type: "ctaCallout" }>,
  key: string,
): ReactNode {
  const mode = block.ctaMode ?? "link";
  const primaryHref = block.ctaHref;
  const isInternal = primaryHref?.startsWith("/") ?? false;
  return (
    <aside key={key} className="blog-cta">
      {block.eyebrow ? (
        <span className="blog-cta-eyebrow">{block.eyebrow}</span>
      ) : null}
      {block.heading ? (
        <h3 className="blog-cta-heading">{formatLine(block.heading)}</h3>
      ) : null}
      {block.sub ? (
        <p className="blog-cta-sub">{formatLine(block.sub)}</p>
      ) : null}
      <div className="blog-cta-actions">
        {block.ctaLabel && mode !== "link" ? (
          <LeadCtaButton
            className="blog-cta-btn primary"
            source={block.leadSource || "blog-cta"}
            formVariant={mode === "modalDemo" ? "demo" : undefined}
          >
            {block.ctaLabel} →
          </LeadCtaButton>
        ) : block.ctaLabel && primaryHref ? (
          isInternal ? (
            <Link href={primaryHref} className="blog-cta-btn primary">
              {block.ctaLabel} →
            </Link>
          ) : (
            <a
              href={primaryHref}
              className="blog-cta-btn primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {block.ctaLabel} →
            </a>
          )
        ) : null}
        {block.ctaSecondaryLabel && block.ctaSecondaryHref ? (
          block.ctaSecondaryHref.startsWith("/") ? (
            <Link
              href={block.ctaSecondaryHref}
              className="blog-cta-btn secondary"
            >
              {block.ctaSecondaryLabel}
            </Link>
          ) : (
            <a
              href={block.ctaSecondaryHref}
              className="blog-cta-btn secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {block.ctaSecondaryLabel}
            </a>
          )
        ) : null}
      </div>
    </aside>
  );
}

function renderBlogTable(
  block: Extract<BlogBodyBlock, { _type: "blogTable" }>,
  key: string,
): ReactNode {
  const headers = block.headers ?? [];
  const rows = block.rows ?? [];
  return (
    <div key={key} className="overflow-x-auto my-7">
      <table className="blog-table">
        {headers.length > 0 ? (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row._key ?? ri}>
              {(row.cells ?? []).map((cell, ci) => (
                <td key={ci}>{formatLine(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlogImage(
  block: Extract<BlogBodyBlock, { _type: "blogImage" }>,
  key: string,
): ReactNode {
  if (!block.asset?.url) return null;
  if (!block.alt) {
    throw new Error(
      `blogImage at ${key} is missing required alt text. Fill the alt field in Sanity Studio.`,
    );
  }
  return (
    <figure key={key} className="blog-image">
      <SanityImg
        image={{ asset: block.asset, crop: block.crop }}
        alt={block.alt}
        sizes={IMG_SIZES.prose}
      />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function renderBlogVideo(
  block: Extract<BlogBodyBlock, { _type: "blogVideo" }>,
  key: string,
): ReactNode {
  // Editors may add the block before the video is ready — skip silently.
  if (!block.youtubeId) return null;
  return (
    <BlogVideo
      key={key}
      youtubeId={block.youtubeId}
      title={block.title}
      caption={block.caption}
    />
  );
}

type ListBucket = {
  kind: "ul" | "ol";
  level: number;
  items: PortableBlock[];
  keyPrefix: string;
};

function flushListBucket(bucket: ListBucket): ReactNode {
  const Tag = bucket.kind;
  return (
    <Tag key={bucket.keyPrefix} className={bucket.kind === "ul" ? "blog-ul" : "blog-ol"}>
      {bucket.items.map((item, i) => (
        <li key={`${bucket.keyPrefix}-${i}`} className="blog-li">
          {renderBlockChildren(item, `${bucket.keyPrefix}-${i}`)}
        </li>
      ))}
    </Tag>
  );
}

export function BlogPortableText({
  value,
}: {
  value: BlogBody | undefined | null;
}): ReactNode {
  if (!value?.length) return null;
  const out: ReactNode[] = [];
  let listBucket: ListBucket | null = null;

  const closeBucket = () => {
    if (listBucket) {
      out.push(flushListBucket(listBucket));
      listBucket = null;
    }
  };

  value.forEach((block, bi) => {
    const key = block._key ?? `b-${bi}`;

    if (isPortableBlock(block) && block.listItem) {
      const kind: "ul" | "ol" = block.listItem === "number" ? "ol" : "ul";
      if (!listBucket || listBucket.kind !== kind) {
        closeBucket();
        listBucket = { kind, level: 1, items: [], keyPrefix: `list-${bi}` };
      }
      listBucket.items.push(block);
      return;
    }

    closeBucket();

    if (isPortableBlock(block)) {
      out.push(renderBlockBody(block, key));
      return;
    }

    if (block._type === "tldrBox") {
      out.push(renderTldrBox(block, key));
    } else if (block._type === "ctaCallout") {
      out.push(renderCtaCallout(block, key));
    } else if (block._type === "blogTable") {
      out.push(renderBlogTable(block, key));
    } else if (block._type === "blogImage") {
      out.push(renderBlogImage(block, key));
    } else if (block._type === "blogVideo") {
      out.push(renderBlogVideo(block, key));
    }
  });

  closeBucket();
  return out;
}
