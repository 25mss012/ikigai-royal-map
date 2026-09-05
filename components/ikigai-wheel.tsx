import type { AssessmentResult } from "@/types";
import { DIMENSIONS } from "@/lib/constants";

export function IkigaiWheel({ result }: { result: AssessmentResult | null }) {
  const size = 300;
  const cx = size / 2, cy = size / 2, R = 120;
  const ids = ["love", "strength", "contribution", "values", "flow"] as const;
  const pct = (id: string) => result?.scores.find((s) => s.id === id)?.percentage ?? 0;
  const pts = ids.map((id, i) => {
    const angle = (Math.PI * 2 * i) / ids.length - Math.PI / 2;
    const r = (R * pct(id)) / 100;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  const ring = (frac: number) =>
    ids.map((_, i) => {
      const angle = (Math.PI * 2 * i) / ids.length - Math.PI / 2;
      const r = R * frac;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  return (
    <figure>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Ikigai map showing five dimension scores" className="mx-auto w-full max-w-[320px]">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="currentColor" opacity={0.2} />
        <polygon points={ring(0.66)} fill="none" stroke="currentColor" opacity={0.2} />
        <polygon points={ring(0.33)} fill="none" stroke="currentColor" opacity={0.2} />
        {ids.map((id, i) => {
          const angle = (Math.PI * 2 * i) / ids.length - Math.PI / 2;
          return <line key={id} x1={cx} y1={cy} x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)} stroke="currentColor" opacity={0.2} />;
        })}
        <polygon points={pts.join(" ")} fill="rgba(201,162,39,0.35)" stroke="#C9A227" strokeWidth={2.5} />
        {ids.map((id, i) => {
          const angle = (Math.PI * 2 * i) / ids.length - Math.PI / 2;
          const lx = cx + (R + 26) * Math.cos(angle), ly = cy + (R + 26) * Math.sin(angle);
          return <text key={id} x={lx} y={ly} textAnchor="middle" fontSize={11} fill="currentColor">{DIMENSIONS[i].titleEn.split(" ")[0]} {pct(id)}%</text>;
        })}
      </svg>
      <figcaption className="sr-only">
        {result ? result.scores.map((s) => `${s.id}: ${s.percentage ?? 0} percent`).join(", ") : "No scores yet."}
      </figcaption>
      {/* Text summary for screen readers & no-JS */}
      <ul className="mx-auto mt-3 grid max-w-md gap-1 text-sm">
        {DIMENSIONS.map((d) => (
          <li key={d.id} className="flex justify-between border-b border-[var(--border)] py-1">
            <span>{d.titleEn}</span><strong>{pct(d.id)}%</strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}
