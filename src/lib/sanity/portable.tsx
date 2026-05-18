import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type {
  BlogBody,
  BlogBodyBlock,
  PortableBlock,
  PortableSpan,
  PortableLinkAnnotation,
} from "./types";

function renderSpan(
  span: PortableSpan,
  markDefs: PortableLinkAnnotation[] | undefined,
  key: string | number,
): ReactNode {
  const marks = span.marks ?? [];

  const linkKey = marks.find(
    (m) => m !== "strong" && m !== "em" && m !== "underline" && m !== "code",
  );
  if (linkKey) {
    const def = markDefs?.find((d) => d._key === linkKey);
    if (def) {
      return (
        <a
          key={key}
          href={def.href}
          target={def.newTab ? "_blank" : undefined}
          rel={def.newTab ? "noopener noreferrer" : undefined}
        >
          {span.text}
        </a>
      );
    }
  }

  let node: ReactNode = span.text;
  if (marks.includes("code")) node = <code>{node}</code>;
  if (marks.includes("strong")) node = <strong>{node}</strong>;
  if (marks.includes("em")) node = <em>{node}</em>;
  if (marks.includes("underline")) node = <u>{node}</u>;
  // Always wrap in a keyed Fragment so plain-text spans in arrays carry a key.
  return <Fragment key={key}>{node}</Fragment>;
}

export function PortableText({
  value,
}: {
  value: PortableBlock[] | undefined | null;
}): ReactNode {
  if (!value?.length) return null;
  return value.map((block, bi) => {
    if (block._type !== "block") return null;
    const children = block.children.map((span, si) =>
      renderSpan(span, block.markDefs, `${bi}-${si}`),
    );
    const style = block.style ?? "normal";
    if (style === "h2") return <h2 key={bi}>{children}</h2>;
    if (style === "h3") return <h3 key={bi}>{children}</h3>;
    if (style === "h4") return <h4 key={bi}>{children}</h4>;
    if (style === "blockquote") return <blockquote key={bi}>{children}</blockquote>;
    return <p key={bi}>{children}</p>;
  });
}

/**
 * Inline-only renderer: returns the spans without wrapping each block in a
 * `<p>`. Use when the parent already provides a paragraph (e.g. Reasons
 * body, ImageText body). Multi-block content is joined with `<br>`.
 */
export function PortableInline({
  value,
}: {
  value: PortableBlock[] | undefined | null;
}): ReactNode {
  if (!value?.length) return null;
  const out: ReactNode[] = [];
  value.forEach((block, bi) => {
    if (block._type !== "block") return;
    if (out.length > 0) out.push(<br key={`br-${bi}`} />);
    block.children.forEach((span, si) => {
      out.push(renderSpan(span, block.markDefs, `${bi}-${si}`));
    });
  });
  return out;
}

/**
 * Lightweight markdown-ish parser for plain `LocalizedString` fields where
 * the schema can't carry portable text but the original JSX had `<br/>`,
 * `<em>` or `<strong>` formatting. Three markers:
 *   - `\n`     → `<br/>`
 *   - `**x**`  → `<strong>x</strong>`
 *   - `*x*`    → `<em>x</em>`
 *
 * Returns plain string when no markers exist, so it's safe to apply
 * universally.
 */
function parseInline(text: string, lineKey: number): ReactNode[] {
  const out: ReactNode[] = [];
  let plain = "";
  const flush = () => {
    if (plain) {
      out.push(plain);
      plain = "";
    }
  };
  let i = 0;
  while (i < text.length) {
    // **strong**
    if (text[i] === "*" && text[i + 1] === "*") {
      const close = text.indexOf("**", i + 2);
      if (close > i + 2 && !text.slice(i + 2, close).includes("\n")) {
        flush();
        out.push(
          <strong key={`s-${lineKey}-${out.length}`}>
            {text.slice(i + 2, close)}
          </strong>,
        );
        i = close + 2;
        continue;
      }
    }
    // *em*
    if (text[i] === "*") {
      const close = text.indexOf("*", i + 1);
      if (close > i + 1 && !text.slice(i + 1, close).includes("\n")) {
        flush();
        out.push(
          <em key={`e-${lineKey}-${out.length}`}>{text.slice(i + 1, close)}</em>,
        );
        i = close + 1;
        continue;
      }
    }
    plain += text[i];
    i += 1;
  }
  flush();
  return out;
}

export function formatLine(value: string | undefined | null): ReactNode {
  if (!value) return null;
  if (!value.includes("\n") && !value.includes("*")) return value;

  const lines = value.split("\n");
  const out: ReactNode[] = [];
  lines.forEach((line, li) => {
    if (li > 0) out.push(<br key={`br-${li}`} />);
    out.push(...parseInline(line, li));
  });
  return out;
}

export function plainPortable(
  value: PortableBlock[] | undefined | null,
): string {
  if (!value?.length) return "";
  return value
    .map((b) => b.children.map((s) => s.text).join(""))
    .join(" ");
}

/* ─── Blog-body renderer ─────────────────────────────────────────────────────
   Dispatches custom block types used by blogPost.body:
     tldrBox, ctaCallout, blogTable, blogImage
   Plus the standard portable-text styles + lists.

   The wrapper page should set typography via Tailwind on a parent
   container (see /blog/[slug]/page.tsx → .blog-post-body).
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
  const primaryHref = block.ctaHref ?? "#";
  const isInternal = primaryHref.startsWith("/");
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
        {block.ctaLabel ? (
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
      <img
        src={block.asset.url}
        alt={block.alt}
        loading="lazy"
        width={block.asset.metadata?.dimensions?.width}
        height={block.asset.metadata?.dimensions?.height}
      />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
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
    }
  });

  closeBucket();
  return out;
}
