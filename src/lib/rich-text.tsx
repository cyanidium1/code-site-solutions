import type { ReactNode } from "react";

export type RichSegment = string | { em: string };
export type RichText = ReadonlyArray<RichSegment>;

export function renderRich(value: RichText): ReactNode {
  return value.map((seg, i) =>
    typeof seg === "string" ? seg : <em key={i}>{seg.em}</em>,
  );
}

export function plainRich(value: RichText): string {
  return value
    .map((seg) => (typeof seg === "string" ? seg : seg.em))
    .join("");
}
