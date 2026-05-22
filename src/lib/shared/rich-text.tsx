import type { ReactNode } from "react";
import Link from "next/link";

export type RichSegment =
  | string
  | { em: string }
  | { link: { href: string; text: string } };
export type RichText = ReadonlyArray<RichSegment>;

export function renderRich(value: RichText): ReactNode {
  return value.map((seg, i) => {
    if (typeof seg === "string") return seg;
    if ("em" in seg) return <em key={i}>{seg.em}</em>;
    return (
      <Link key={i} href={seg.link.href} className="rich-link">
        {seg.link.text}
      </Link>
    );
  });
}

export function plainRich(value: RichText): string {
  return value
    .map((seg) => {
      if (typeof seg === "string") return seg;
      if ("em" in seg) return seg.em;
      return seg.link.text;
    })
    .join("");
}
