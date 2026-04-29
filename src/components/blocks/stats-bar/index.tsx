import "./stats-bar.css";

export type StatItem = { value: React.ReactNode; label: string };

export function StatsBar({ items }: { items: StatItem[] }) {
  return (
    <section className="stats-bar">
      <div className="stats-bar-container">
        <div className="stats-bar-grid">
          {items.map((it, i) => (
            <div key={i} className="stats-bar-cell">
              <span className="stats-bar-value">{it.value}</span>
              <span className="stats-bar-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
