"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, clearAllIkigai, exportAll, getJSON, getValidated, isAssessmentResultLike, storageAvailable } from "@/lib/storage";
import { planProgress } from "@/data/plan-templates";
import { REFLECTION_PROMPTS_EN } from "@/data/reflection-prompts";
import { downloadJSON } from "@/lib/export-data";
import { Card, SectionHeading, ProgressBar, EmptyState } from "@/components/ui";
import type { AssessmentResult, FlowEntry, JournalEntry, PlanDay, CircleEntry } from "@/types";

export default function DashboardPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [flow, setFlow] = useState<FlowEntry[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [plan, setPlan] = useState<PlanDay[] | null>(null);
  const [circle, setCircle] = useState<CircleEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [privateOk, setPrivateOk] = useState(true);

  useEffect(() => {
    setResult(getValidated<AssessmentResult | null>(STORAGE_KEYS.result, null, (v): v is AssessmentResult | null => v === null || isAssessmentResultLike(v)));
    setFlow(asArray<FlowEntry>(getJSON<unknown>(STORAGE_KEYS.flow, [])));
    setJournal(asArray<JournalEntry>(getJSON<unknown>(STORAGE_KEYS.journal, [])));
    setPlan(getValidated<PlanDay[] | null>(STORAGE_KEYS.plan, null, (v): v is PlanDay[] | null => v === null || Array.isArray(v)));
    setCircle(asArray<CircleEntry>(getJSON<unknown>(STORAGE_KEYS.circle, [])));
    setPrivateOk(storageAvailable());
    setReady(true);
  }, []);

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-12"><p>Loading…</p></div>;
  const hasAny = result || flow.length || journal.length || plan || circle.length;
  const pp = plan ? planProgress(plan) : null;
  const prompt = REFLECTION_PROMPTS_EN[new Date().getDate() % REFLECTION_PROMPTS_EN.length];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker="Dashboard" title={`${greet}. Small steps count.`} desc="A calm overview. Useful even when empty." />
      {!hasAny && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card><p className="font-semibold">Your journey begins with one small reflection.</p></Card>
          <Card><p className="font-semibold">You do not need to know your purpose before you begin.</p></Card>
          <Card><p className="font-semibold">Try one five-minute experiment.</p></Card>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Reflection</h2>
          {result ? (<><p className="mt-1 text-3xl font-bold">{result.overall ?? "—"}%</p><p className="text-sm text-[var(--muted)]">{result.archetype} · {result.completionPct}% complete{result.provisional ? " · provisional" : ""}</p><Link href="/assessment/results" className="mt-2 inline-block text-sm underline">Open result</Link></>)
          : (<><p className="mt-1 text-sm text-[var(--muted)]">No assessment yet.</p><Link href="/assessment" className="mt-2 inline-block rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Start assessment</Link></>)}
        </Card>
        <Card>
          <h2 className="font-bold">Today’s prompt</h2>
          <p className="mt-1 text-sm italic">“{prompt}”</p>
          <Link href="/journal" className="mt-2 inline-block text-sm underline">Write 5 minutes</Link>
          <h2 className="mt-4 font-bold">Plan</h2>
          {pp ? (<div className="mt-1"><ProgressBar value={pp.pct} label={`Day ${pp.currentDay}/30 · ${pp.done} done`} /></div>)
          : (<Link href="/plan" className="text-sm underline">Generate 30-day plan</Link>)}
        </Card>
        <Card>
          <h2 className="font-bold">Recent life</h2>
          <p className="mt-1 text-sm">Journal: {journal[0] ? `${journal[0].date} — ${journal[0].text.slice(0, 60)}…` : "—"}</p>
          <p className="mt-1 text-sm">Flow: {flow[0] ? `${flow[0].activity} (${flow[0].flowScore}/5)` : "—"}</p>
          <p className="mt-1 text-sm">Circle: {circle.length ? `${circle.length} connection(s)${circle[0]?.nextIntention ? ` · next: ${circle[0].nextIntention}` : ""}` : "—"}</p>
          <div className="mt-2 flex gap-3 text-sm"><Link href="/journal" className="underline">Journal</Link><Link href="/flow" className="underline">Flow</Link><Link href="/circle" className="underline">Circle</Link></div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Quick actions</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Link href="/learn" className="rounded-full border border-[var(--border)] px-4 py-2">Learn 3 min</Link>
            <Link href="/flow" className="rounded-full border border-[var(--border)] px-4 py-2">Log flow</Link>
            <Link href="/journal" className="rounded-full border border-[var(--border)] px-4 py-2">Journal</Link>
            <Link href="/circle" className="rounded-full border border-[var(--border)] px-4 py-2">Circle</Link>
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">Privacy</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Storage: {privateOk ? "browser localStorage available" : "fallback memory (export often — browser blocks storage)"} · No account · No tracking.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm" onClick={() => downloadJSON("ikigai-all-data.json", exportAll())}>Export all data</button>
            <button className="rounded-full border border-error px-4 py-2 text-sm text-error" onClick={() => { if (confirm("Delete ALL local data? This cannot be undone. Export first if needed.")) { clearAllIkigai(); location.reload(); } }}>Delete all data</button>
          </div>
        </Card>
      </div>
      {!hasAny && <div className="mt-4"><EmptyState title="Nothing here yet — and that is fine" desc="Begin with one essay, one question, or one five-minute note." action={<Link href="/learn" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Read one essay</Link>} /></div>}
    </div>
  );
}
