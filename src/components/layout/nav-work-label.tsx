"use client";

import { NAV_CASE_COUNT_LINK_KEY } from "@/constants/nav";
import { useCaseCount } from "./case-count-provider";

const caseCountClass =
  "bg-brand-gradient bg-clip-text text-transparent font-normal";

/** Appends `[n]` to the Cases/Кейси nav label (published portfolio index size). */
export function NavWorkLabel({
  label,
  linkKey,
}: {
  label: string;
  linkKey: string;
}) {
  const count = useCaseCount();
  if (linkKey !== NAV_CASE_COUNT_LINK_KEY || count == null) {
    return <>{label}</>;
  }
  return (
    <>
      {label}{" "}
      <span className={caseCountClass}>[{count}]</span>
    </>
  );
}
