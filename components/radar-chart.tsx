"use client";
import { useEffect, useState } from "react";
import type { AssessmentResult } from "@/types";
import { DIMENSIONS } from "@/lib/constants";

export function RadarChartView({ result }: { result: AssessmentResult | null }) {
  if (!result) return <p className="text-sm text-[var(--muted)]">Complete the assessment to see your pattern chart.</p>;
  return <RadarInner result={result} />;
}

function RadarInner({ result }: { result: AssessmentResult }) {
  const [mods, setMods] = useState<any>(null);

  useEffect(() => {
    let live = true;
    import("recharts")
      .then((m) => { if (live) setMods(m); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const data = DIMENSIONS.map((d) => ({
    dim: d.titleEn.split(" ")[0],
    v: result.scores.find((s) => s.id === d.id)?.percentage ?? 0,
  }));

  if (!mods) {
    return (
      <ul className="grid gap-1 text-sm" aria-label="Dimension scores">
        {data.map((d) => <li key={d.dim} className="flex justify-between border-b border-[var(--border)] py-1"><span>{d.dim}</span><strong>{d.v}%</strong></li>)}
      </ul>
    );
  }

  const { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } = mods;
  return (
    <div style={{ width: "100%", height: 300 }} role="img" aria-label={`Radar chart: ${data.map((d) => `${d.dim} ${d.v} percent`).join(", ")}`}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
          <Radar dataKey="v" stroke="#C9A227" fill="#C9A227" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
