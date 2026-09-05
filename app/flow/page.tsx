"use client";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, getJSON, setJSON } from "@/lib/storage";
import { flowScore } from "@/lib/scoring";
import { downloadJSON } from "@/lib/export-data";
import { uid, todayISO } from "@/lib/utils";
import { Button, Card, EmptyState, Notice, SectionHeading } from "@/components/ui";
import type { FlowEntry } from "@/types";

const SETTINGS = ["alone", "with-others", "online", "outdoors", "mixed"] as const;

export default function FlowPage() {
  const [entries, setEntries] = useState<FlowEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ activity: "", date: todayISO(), timeOfDay: "morning", durationMin: 25, focus: 3, enjoyment: 3, difficulty: 3, confidence: 3, setting: "alone" as FlowEntry["setting"], notes: "" });
  const [error, setError] = useState("");

  useEffect(() => { setEntries(asArray<FlowEntry>(getJSON<unknown>(STORAGE_KEYS.flow, []))); setLoaded(true); }, []);
  useEffect(() => { if (loaded) setJSON(STORAGE_KEYS.flow, entries); }, [entries, loaded]);

  const stats = useMemo(() => {
    if (!entries.length) return null;
    const avg = entries.reduce((a, e) => a + e.flowScore, 0) / entries.length;
    const top = [...entries].sort((a, b) => b.flowScore - a.flowScore).slice(0, 3);
    const settingCount: Record<string, number> = {};
    entries.forEach((e) => { settingCount[e.setting] = (settingCount[e.setting] ?? 0) + 1; });
    const commonSetting = Object.entries(settingCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekly = entries.filter((e) => new Date(e.date) >= weekAgo).length;
    return { avg: Math.round(avg * 10) / 10, top, commonSetting, weekly, total: entries.length };
  }, [entries]);

  const add = () => {
    if (form.activity.trim().length < 2) { setError("Give the activity a short name."); return; }
    if (!form.date) { setError("Choose a date."); return; }
    setError("");
    const s = flowScore(form.focus, form.enjoyment, form.difficulty, form.confidence);
    setEntries((es) => [{ id: uid("flow"), ...form, activity: form.activity.trim(), notes: form.notes.trim(), flowScore: s }, ...es]);
    setForm((f) => ({ ...f, activity: "", notes: "" }));
  };

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>Loading…</p></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker="Flow Lab" title="When does time soften?" desc="Log focus, joy, and challenge fit. Flow never decides a career — it hints at conditions." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="font-bold">Add an activity</h2>
          <label className="mt-3 block text-sm">Activity name<input value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder="e.g. sketching, cooking" /></label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-sm">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
            <label className="text-sm">Time of day<select value={form.timeOfDay} onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="night">Night</option></select></label>
          </div>
          <label className="mt-2 block text-sm">Duration (min)<input type="number" min={1} max={1440} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {[["focus", "Focus"], ["enjoyment", "Enjoyment"], ["difficulty", "Difficulty"], ["confidence", "Confidence"]].map(([k, label]) => (
            <label key={k} className="mt-2 block text-sm">{label} (1–5)<input type="range" min={1} max={5} value={(form as unknown as Record<string, number>)[k]} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} className="mt-1 w-full" aria-label={label} /><span className="font-bold">{(form as unknown as Record<string, number>)[k]}</span></label>
          ))}
          <fieldset className="mt-2"><legend className="text-sm">Setting</legend><div className="mt-1 flex flex-wrap gap-2">{SETTINGS.map((s) => <button key={s} type="button" onClick={() => setForm({ ...form, setting: s })} aria-pressed={form.setting === s} className={`rounded-full border px-3 py-1.5 text-sm ${form.setting === s ? "border-imperial bg-imperial/15" : "border-[var(--border)]"}`}>{s}</button>)}</div></fieldset>
          <label className="mt-2 block text-sm">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
          <div className="mt-3"><Button onClick={add}>Add entry</Button></div>
        </Card>
        <div className="lg:col-span-3">
          {stats ? (
            <div className="grid gap-4">
              <Card><h2 className="font-bold">Your pattern</h2>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Average flow</dt><dd className="text-xl font-bold">{stats.avg}/5</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Total</dt><dd className="text-xl font-bold">{stats.total}</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">This week</dt><dd className="text-xl font-bold">{stats.weekly}</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Common setting</dt><dd className="text-xl font-bold">{stats.commonSetting}</dd></div>
                </dl>
                <p className="mt-3 text-sm"><strong>Most engaging:</strong> {stats.top.map((t) => `${t.activity} (${t.flowScore})`).join(" · ")}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Try more of what scores high; reduce one friction (noise, phone, unclear start) for the rest.</p>
                <div className="mt-3"><button className="text-sm underline" onClick={() => downloadJSON("flow-entries.json", entries)}>Export JSON</button></div>
              </Card>
              <ul className="grid gap-2">
                {entries.map((e) => (
                  <li key={e.id} className="royal-card flex items-center justify-between gap-3 p-4">
                    <div><p className="font-semibold">{e.activity} <span className="ml-2 rounded-full bg-imperial/15 px-2 py-0.5 text-xs font-bold">{e.flowScore}/5</span></p>
                    <p className="text-xs text-[var(--muted)]">{e.date} · {e.timeOfDay} · {e.durationMin} min · {e.setting} · f{e.focus} j{e.enjoyment} d{e.difficulty} c{e.confidence}</p></div>
                    <button className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm" onClick={() => { if (confirm("Delete this entry?")) setEntries((es) => es.filter((x) => x.id !== e.id)); }}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState title="No flow entries yet" desc="Log one activity you got absorbed in. Two minutes is enough." />
          )}
          <div className="mt-4"><Notice>Flow hints at good conditions — not at a destiny or a job title.</Notice></div>
        </div>
      </div>
    </div>
  );
}
