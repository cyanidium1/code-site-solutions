"use client";

import type { TableRowData } from "@/types/pricing";

export function TableRow({
  param,
  wp,
  wix,
  custom,
  labels,
}: TableRowData & { labels: string[] }) {
  return (
    <tr>
      <td className="cmp-td-param" data-label={labels[0]}>
        {param}
      </td>
      <td className="cmp-td-bad" data-label={labels[1]}>
        {wp}
      </td>
      <td className="cmp-td-bad" data-label={labels[2]}>
        {wix}
      </td>
      <td className="cmp-td-good" data-label={labels[3]}>
        {custom}
      </td>
    </tr>
  );
}
