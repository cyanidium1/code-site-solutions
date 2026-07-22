import { Fragment, type ReactNode } from "react";
import type {
  PortableBlock,
  PortableSpan,
  PortableLinkAnnotation,
} from "@/types/sanity";

export function renderSpan(
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
    if (style === "h2")
      return <h2 key={bi} className="font-actay uppercase">{children}</h2>;
    if (style === "h3")
      return <h3 key={bi} className="font-actay uppercase">{children}</h3>;
    if (style === "h4")
      return <h4 key={bi} className="font-actay uppercase">{children}</h4>;
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

/* The blog-body renderer (BlogPortableText) lives in blog-portable.tsx —
   it imports client components (lead-modal button, video facade) that
   must not enter the module graph of every page using this file. */
