import type { PieSlice } from "@/lib/chart-data";

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy + r * Math.sin(startAngle),
  };
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy + r * Math.sin(endAngle),
  };
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

export function TurnoutPieChart({
  slices,
  caption = "Votes to Date",
}: {
  slices: PieSlice[];
  caption?: string;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const size = 112;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  let angle = -Math.PI / 2;

  const arcs = slices.map((slice) => {
    const sweep = (slice.value / total) * Math.PI * 2;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { slice, d: arcPath(cx, cy, r, start, end) };
  });

  return (
    <figure className="turnout-pie" aria-label={`${caption} breakdown`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-hidden="true"
      >
        {arcs.map(({ slice, d }) => (
          <path
            key={slice.label}
            d={d}
            fill={slice.color}
            stroke="var(--paper-elevated)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <figcaption className="turnout-pie-caption">{caption}</figcaption>
      <ul className="turnout-pie-legend">
        {slices.map((slice) => {
          const pct = ((slice.value / total) * 100).toFixed(1);
          return (
            <li key={slice.label}>
              <span
                className="turnout-pie-swatch"
                style={{ background: slice.color }}
              />
              <span className="turnout-pie-label">{slice.label}</span>
              <span className="turnout-pie-pct">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
