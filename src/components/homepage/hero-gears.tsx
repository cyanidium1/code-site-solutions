/* ───────────────────────────────────────────────────────────────────────
   HERO GEARS — a slow neon mechanism behind the home hero (owner request,
   2026-09-18: "крутящиеся шестерёнки разного размера, типа механизм,
   неоновые контуры фиолетовые" → "чтобы они как бы крутили друг друга").

   The gears are not drawn by hand, they are derived from one gear train:

   - every wheel shares the same MODULE (pitch diameter ÷ teeth), which is
     the real-world condition for two gears to mesh at all;
   - a child is placed on its parent's pitch circle sum, at a direction
     SNAPPED to one of the parent's tooth centres, and its own phase is set
     so a tooth gap faces back — so a tooth always enters a gap and the
     wheels never overlap, whatever the tooth counts;
   - directions alternate at every contact and the periods are exactly
     proportional to the tooth counts (18/12/9/7 → 90/60/45/35s), which is
     the gear ratio — so the mesh that is correct at t=0 stays correct.

   Rendering: one inline SVG, four CSS rotations, no client JS and no
   filters. Each gear is a <g> whose only animated property is `transform`,
   so the layer composites on the GPU and never repaints. The neon is two
   stroked copies of the same geometry (a wide faint halo under a thin
   line), not a drop-shadow: a blurred filter on a spinning layer costs a
   repaint per frame, and the site's design language is glow anyway.

   Decoration only: aria-hidden, pointer-events-none, and it sits at z-[-2]
   inside the hero shell — behind the device mockup (z-[-1] in the mobile
   stack) and far behind the copy.
   ─────────────────────────────────────────────────────────────────── */

const DEG = Math.PI / 180;

/** Pitch diameter ÷ teeth. Shared by every wheel — that is what meshes. */
const MODULE = 14;
/** Tooth height above / root depth below the pitch circle, in modules. */
const TOOTH = 0.8;

type GearSpec = {
  id: string;
  teeth: number;
  /** Full turn, seconds. Kept proportional to `teeth` — that is the ratio. */
  durationSec: number;
  /** Which wheel it rides on, and roughly where (deg, SVG angles: y down). */
  parent?: string;
  aimDeg?: number;
};

const TRAIN: GearSpec[] = [
  { id: "a", teeth: 18, durationSec: 90 },
  { id: "b", teeth: 12, durationSec: 60, parent: "a", aimDeg: -35 },
  { id: "c", teeth: 9, durationSec: 45, parent: "a", aimDeg: 48 },
  { id: "d", teeth: 7, durationSec: 35, parent: "b", aimDeg: -18 },
];

type Gear = GearSpec & {
  cx: number;
  cy: number;
  /** Angle of tooth 0's leading root point. Locks the mesh. */
  phaseDeg: number;
  reverse: boolean;
  rPitch: number;
  rTip: number;
  rRoot: number;
  rHub: number;
};

function place(spec: GearSpec, parent?: Gear): Gear {
  const rPitch = (MODULE * spec.teeth) / 2;
  const step = 360 / spec.teeth;
  const base = {
    ...spec,
    rPitch,
    rTip: rPitch + MODULE * TOOTH,
    rRoot: rPitch - MODULE * TOOTH,
    rHub: Math.max(14, rPitch * 0.36),
  };

  if (!parent) return { ...base, cx: 0, cy: 0, phaseDeg: 0, reverse: false };

  // Snap the contact direction to a tooth centre of the parent: the parent
  // pushes with a tooth, so the contact can only happen where it has one.
  // Tooth centres sit at parent.phase + (i + 0.25) * parentStep.
  const parentStep = 360 / parent.teeth;
  const i = Math.round(
    ((spec.aimDeg ?? 0) - parent.phaseDeg - 0.25 * parentStep) / parentStep,
  );
  const contact = parent.phaseDeg + (i + 0.25) * parentStep;
  const dist = parent.rPitch + rPitch;

  return {
    ...base,
    cx: parent.cx + dist * Math.cos(contact * DEG),
    cy: parent.cy + dist * Math.sin(contact * DEG),
    // Face the parent with a gap (gap centres: phase + (j + 0.75) * step).
    phaseDeg: contact + 180 - 0.75 * step,
    reverse: !parent.reverse,
  };
}

function buildTrain(): Gear[] {
  const byId = new Map<string, Gear>();
  const gears = TRAIN.map((spec) => {
    const gear = place(spec, spec.parent ? byId.get(spec.parent) : undefined);
    byId.set(gear.id, gear);
    return gear;
  });

  // Normalise to a tidy viewBox with the origin at the cluster's top-left.
  const pad = 2;
  const minX = Math.min(...gears.map((g) => g.cx - g.rTip)) - pad;
  const minY = Math.min(...gears.map((g) => g.cy - g.rTip)) - pad;
  return gears.map((g) => ({ ...g, cx: g.cx - minX, cy: g.cy - minY }));
}

const GEARS = buildTrain();
const VIEW_W = Math.ceil(Math.max(...GEARS.map((g) => g.cx + g.rTip)) + 2);
const VIEW_H = Math.ceil(Math.max(...GEARS.map((g) => g.cy + g.rTip)) + 2);

const r2 = (n: number) => Math.round(n * 100) / 100;

function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = aDeg * DEG;
  return `${r2(cx + r * Math.cos(a))} ${r2(cy + r * Math.sin(a))}`;
}

/** Outer outline: root arc → flank → tip → flank, once per tooth. The tip
 *  spans 0.22 of the pitch and the root 0.5, so a tooth is comfortably
 *  thinner than the gap it drops into. */
function toothedPath({ cx, cy, teeth, rTip, rRoot, phaseDeg }: Gear) {
  const step = 360 / teeth;
  let d = `M${polar(cx, cy, rRoot, phaseDeg)}`;
  for (let i = 0; i < teeth; i++) {
    const a = phaseDeg + i * step;
    d += `L${polar(cx, cy, rTip, a + step * 0.14)}`;
    d += `L${polar(cx, cy, rTip, a + step * 0.36)}`;
    d += `L${polar(cx, cy, rRoot, a + step * 0.5)}`;
    d += `A${r2(rRoot)} ${r2(rRoot)} 0 0 1 ${polar(cx, cy, rRoot, a + step)}`;
  }
  return `${d}Z`;
}

function spokes(g: Gear, count: number) {
  const rim = g.rRoot * 0.66;
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * 360 + g.phaseDeg;
    return (
      <line
        key={i}
        x1={r2(g.cx + g.rHub * Math.cos(a * DEG))}
        y1={r2(g.cy + g.rHub * Math.sin(a * DEG))}
        x2={r2(g.cx + rim * Math.cos(a * DEG))}
        y2={r2(g.cy + rim * Math.sin(a * DEG))}
      />
    );
  });
}

function GearGeometry({ gear }: { gear: Gear }) {
  const showSpokes = gear.teeth >= 9;
  return (
    <g id={`hero-gear-${gear.id}`}>
      <path d={toothedPath(gear)} />
      {showSpokes ? (
        <circle cx={r2(gear.cx)} cy={r2(gear.cy)} r={r2(gear.rRoot * 0.66)} />
      ) : null}
      <circle cx={r2(gear.cx)} cy={r2(gear.cy)} r={r2(gear.rHub)} />
      {showSpokes ? spokes(gear, gear.teeth >= 18 ? 6 : 5) : null}
    </g>
  );
}

export function HeroGears({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-gears ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" focusable="false">
        <defs>
          {GEARS.map((g) => (
            <GearGeometry key={g.id} gear={g} />
          ))}
        </defs>
        {GEARS.map((g) => (
          <g
            key={g.id}
            className="hero-gear"
            // Per-gear duration, direction and centre of rotation: three
            // values that differ for every wheel and are computed from the
            // gear train above, so they cannot be Tailwind utilities.
            // eslint-disable-next-line react/forbid-dom-props
            style={
              {
                "--gear-dur": `${g.durationSec}s`,
                animationDirection: g.reverse ? "reverse" : "normal",
                transformOrigin: `${r2(g.cx)}px ${r2(g.cy)}px`,
              } as React.CSSProperties
            }
          >
            <use href={`#hero-gear-${g.id}`} className="hero-gear-halo" />
            <use href={`#hero-gear-${g.id}`} className="hero-gear-line" />
          </g>
        ))}
      </svg>
    </div>
  );
}
