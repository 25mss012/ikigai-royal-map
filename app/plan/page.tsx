"use client";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { getValidated, setJSON } from "@/lib/storage";
import { buildPlan, planProgress } from "@/data/plan-templates";
import { todayISO } from "@/lib/utils";
import { usePrefs } from "@/components/providers";
import { Button, Card, EmptyState, SectionHeading, ProgressBar } from "@/components/ui";
import type { PlanDay } from "@/types";

export default function PlanPage() {
  const { prefs } = usePrefs();
  const lang = prefs.lang;
  const [days, setDays] = useState<PlanDay[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDays(getValidated<PlanDay[] | null>(STORAGE_KEYS.plan, null, (v): v is PlanDay[] | null => v === null || (Array.isArray(v) && v.every((d) => d !== null && typeof d === "object" && typeof (d as PlanDay).day === "number"))));
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded && days) setJSON(STORAGE_KEYS.plan, days); }, [days, loaded]);

  const start = () => setDays(buildPlan(todayISO()));
  const setStatus = (day: number, status: PlanDay["status"]) =>
    setDays((ds) => (ds ?? []).map((d) => (d.day === day ? { ...d, status } : d)));
  const reschedule = (day: number) =>
    setDays((ds) => {
      if (!ds) return ds;
      const i = ds.findIndex((d) => d.day === day);
      if (i === -1 || i === ds.length - 1) return ds;
      const copy = [...ds];
      const [item] = copy.splice(i, 1);
      copy.splice(i + 1, 0, item);
      return copy.map((d, idx) => ({ ...d, day: idx + 1 }));
    });

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>Loading…</p></div>;

  if (!days) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <SectionHeading kicker="30-day purpose plan" title="One small step a day" desc="Explore · Learn · Create · Serve · Connect · Restore · Reflect. Depth grows; pressure does not." />
        <EmptyState title="No plan yet" desc="Generate a gentle 30-day plan. Each day has one small task, time estimate, and a skip-without-shame button."
          action={<Button onClick={start}>Generate my plan</Button>} />
      </div>
    );
  }

  const p = planProgress(days);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading kicker="30-day purpose plan" title={`Day ${p.currentDay} of 30`} desc="Small, reversible, observable. Reschedule kindly when life happens." />
      <div className="mb-6"><ProgressBar value={p.pct} label={`${p.done} done · ${p.skipped} skipped · ${p.pct}%`} /></div>
      <ol className="grid gap-3">
        {days.map((d) => (
          <li key={d.day} className="royal-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold-contrast)]">Day {d.day} · {d.category} · ~{d.minutes} min · {["", "Gentle", "Steady", "Stretch"][d.difficulty]}</p>
              <p className="text-xs text-[var(--muted)]">{d.scheduledDate}</p>
            </div>
            <h2 className="mt-1 text-lg font-bold">{lang === "ta" ? d.taskTa : d.taskEn}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{lang === "ta" ? d.whyTa : d.whyEn}</p>
            <p className="mt-1 text-sm italic">Reflect: {lang === "ta" ? d.promptTa : d.promptEn}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setStatus(d.day, "done")} aria-pressed={d.status === "done"} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${d.status === "done" ? "border-success bg-success/15" : "border-[var(--border)]"}`}>✓ Done</button>
              <button onClick={() => setStatus(d.day, "skipped")} aria-pressed={d.status === "skipped"} className={`rounded-full border px-4 py-1.5 text-sm ${d.status === "skipped" ? "border-warning bg-warning/10" : "border-[var(--border)]"}`}>Skip kindly</button>
              {d.status !== "todo" && <button onClick={() => setStatus(d.day, "todo")} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm">Reopen</button>}
              <button onClick={() => reschedule(d.day)} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm">Move to tomorrow</button>
            </div>
            {d.day === 30 && (
              <div className="mt-4 grid gap-2 rounded-2xl bg-black/[0.03] p-4 text-sm dark:bg-white/[0.05]">
                <p className="font-bold">Final synthesis — write in your journal:</p>
                <p>What I learned · What I want to continue · What I want to stop · What I want to explore next · My next 7-day experiment.</p>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => { if (confirm("Start over with a fresh plan?")) start(); }}>Regenerate</Button>
        <Button variant="danger" onClick={() => { if (confirm("Delete the whole plan?")) setDays(null); }}>Delete plan</Button>
      </div>
    </div>
  );
}
