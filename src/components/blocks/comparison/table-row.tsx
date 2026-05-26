"use client";

import type { TableRowData } from "@/types/pricing";
import { CmpTd } from "./cmp-table";

export function TableRow({
  param,
  wp,
  wix,
  custom,
  labels,
}: TableRowData & { labels: string[] }) {
  return (
    <tr>
      <CmpTd kind="param" data-label={labels[0]}>
        {param}
      </CmpTd>
      <CmpTd kind="bad" data-label={labels[1]}>
        {wp}
      </CmpTd>
      <CmpTd kind="bad" data-label={labels[2]}>
        {wix}
      </CmpTd>
      <CmpTd kind="good" data-label={labels[3]}>
        {custom}
      </CmpTd>
    </tr>
  );
}
