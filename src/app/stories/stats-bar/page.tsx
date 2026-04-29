import { StatsBar } from "@/components/blocks/stats-bar";

export const metadata = { title: "Story · stats-bar" };

const dashed = (
  <hr style={{ border: "none", borderTop: "1px dashed var(--line)", margin: 0 }} />
);

export default function StatsBarStory() {
  return (
    <>
      <StatsBar
        items={[
          { value: "30+", label: "проектів запущено" },
          { value: "5", label: "країн (UA, EU, US, DK)" },
          { value: "4.9/5", label: "середня оцінка" },
          { value: "з 2023", label: "року на ринку" },
        ]}
      />
      {dashed}

      <StatsBar
        items={[
          { value: "47", label: "клінік запущено" },
          { value: "4.9/5", label: "середня оцінка" },
          { value: "×3.2", label: "більше записів" },
        ]}
      />
      {dashed}

      <StatsBar
        items={[
          {
            value: (
              <>
                ×<em>3.2</em>
              </>
            ),
            label: "більше заявок",
          },
          { value: <em>$4M</em>, label: "залучено інвестицій" },
          {
            value: (
              <>
                LCP <em>0.6s</em>
              </>
            ),
            label: "core web vitals",
          },
          {
            value: (
              <>
                <em>98</em>/100
              </>
            ),
            label: "lighthouse score",
          },
        ]}
      />
    </>
  );
}
