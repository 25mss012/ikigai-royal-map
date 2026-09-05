"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS, DIMENSIONS } from "@/lib/constants";
import { getJSON, removeKey } from "@/lib/storage";
import { experimentsFor, promptsFor } from "@/lib/recommendations";
import { downloadJSON } from "@/lib/export-data";
import { usePrefs } from "@/components/providers";
import { Button, Card, EmptyState, Notice, SectionHeading } from "@/components/ui";
import { IkigaiWheel } from "@/components/ikigai-wheel";
import { RadarChartView } from "@/components/radar-chart";
import type { AssessmentResult } from "@/types";

export default function ResultsPage() {
  const { prefs } = usePrefs();
  const lang = prefs.lang;
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResult(getJSON<AssessmentResult | null>(STORAGE_KEYS.result, null));
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>Loading…</p></div>;
  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState title="No result yet" desc="Take the 40-question assessment first. It takes about 10 minutes and saves as you go."
          action={<Link href="/assessment" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Start assessment</Link>} />
      </div>
    );
  }

  const name = (id: string | null) => DIMENSIONS.find((d) => d.id === id)?.[lang === "ta" ? "titleTa" : "titleEn"] ?? "—";
  const experiments = experimentsFor(result);
  const prompts = promptsFor(result, lang);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker={result.provisional ? "Provisional · current snapshot" : "Current snapshot"} title={`Welcome, ${result.archetype}`}
        desc="This is a temporary pattern based on your answers, not a permanent label." />
      {result.provisional && <div className="mx-auto mb-6 max-w-3xl"><Notice tone="warn">This result is provisional — completion {result.completionPct}%. “Not sure” answers were excluded, not scored as zero. Complete the assessment later for a fuller picture.</Notice></div>}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Your dimensions</h2>
          <ul className="mt-3 space-y-3">
            {result.scores.map((s) => (
              <li key={s.id}>
                <div className="flex justify-between text-sm"><span>{name(s.id)}</span><strong>{s.percentage ?? "—"}% · {s.answered}/{s.total}</strong></div>
                <div className="mt-1 h-2 rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-imperial" style={{ width: `${s.percentage ?? 0}%` }} /></div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Overall</dt><dd className="text-xl font-bold">{result.overall ?? "—"}%</dd></div>
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Balance</dt><dd className="text-xl font-bold">{result.balance ?? "—"}%</dd></div>
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Done</dt><dd className="text-xl font-bold">{result.completionPct}%</dd></div>
          </dl>
          <p className="mt-3 text-sm text-[var(--muted)]">Strongest: <strong className="text-[var(--fg)]">{name(result.strongest)}</strong> · Growth: <strong className="text-[var(--fg)]">{name(result.growth)}</strong></p>
        </Card>
        <Card><h2 className="font-bold">Your Ikigai map</h2><div className="mt-2"><IkigaiWheel result={result} /></div></Card>
      </div>

      <div className="mt-4"><Card><h2 className="font-bold">Pattern chart</h2><div className="mt-2"><RadarChartView result={result} /></div></Card></div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Three small experiments</h2>
          <ul className="mt-3 space-y-3">
            {experiments.map((e) => (
              <li key={e.titleEn} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold-contrast)]">{e.kind} · {e.minutes} min</p>
                <p className="font-semibold">{lang === "ta" ? e.titleTa : e.titleEn}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{lang === "ta" ? e.detailTa : e.detailEn}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--muted)]">Small · low-cost · time-bound · reversible · observable.</p>
        </Card>
        <Card>
          <h2 className="font-bold">Reflection prompts</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{prompts.map((p) => <li key={p}>{p}</li>)}</ul>
          <h2 className="mt-5 font-bold">Limitations</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">This is a reflection indicator — not IQ, personality type, diagnosis, or destiny. It reflects today’s answers only. Purpose can change; you can hold several at once.</p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 no-print">
        <Link href="/plan" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Start 30-day plan</Link>
        <Link href="/flow" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">Open Flow Lab</Link>
        <Link href="/journal" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">Write journal entry</Link>
        <button className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={() => window.print()}>Print</button>
        <button className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={() => downloadJSON("ikigai-result.json", result)}>Export JSON</button>
        <button className="rounded-full border border-error px-5 py-2.5 text-sm font-semibold text-error" onClick={() => { if (confirm("Delete this result?")) { removeKey(STORAGE_KEYS.result); setResult(null); } }}>Reset</button>
      </div>

      <div className="mt-6"><Card><h2 className="font-bold">Share-safe summary</h2><p className="mt-1 text-sm">My current reflection: {result.archetype} · Overall {result.overall}% · Strongest {name(result.strongest)} · Exploring {name(result.growth)} · Provisional: {result.provisional ? "yes" : "no"}. (No journal text included.)</p></Card></div>
    </div>
  );
}
