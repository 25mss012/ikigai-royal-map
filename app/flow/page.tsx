"use client";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, getJSON, setJSON } from "@/lib/storage";
import { flowScore } from "@/lib/scoring";
import { downloadJSON } from "@/lib/export-data";
import { uid, todayISO } from "@/lib/utils";
import { usePrefs } from "@/components/providers";
import { Button, Card, EmptyState, Notice, SectionHeading } from "@/components/ui";
import type { FlowEntry } from "@/types";

const SETTINGS = ["alone", "with-others", "online", "outdoors", "mixed"] as const;

const STR = {
  en: {
    kicker: "Flow Lab", title: "When does time soften?",
    desc: "Log focus, joy, and challenge fit. Flow never decides a career — it hints at conditions.",
    add: "Add an activity", activity: "Activity name", activityPh: "e.g. sketching, cooking",
    date: "Date", time: "Time of day", morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night",
    duration: "Duration (min)", setting: "Setting", notes: "Notes",
    sliders: [["focus", "Focus"], ["enjoyment", "Enjoyment"], ["difficulty", "Difficulty"], ["confidence", "Confidence"]] as Array<[string, string]>,
    errName: "Give the activity a short name.", errDate: "Choose a date.",
    addEntry: "Add entry", pattern: "Your pattern", avg: "Average flow", total: "Total",
    week: "This week", common: "Common setting", engaging: "Most engaging:",
    advice: "Try more of what scores high; reduce one friction (noise, phone, unclear start) for the rest.",
    export: "Export JSON", del: "Delete", confirmDel: "Delete this entry?",
    emptyT: "No flow entries yet", emptyD: "Log one activity you got absorbed in. Two minutes is enough.",
    note: "Flow hints at good conditions — not at a destiny or a job title.", loading: "Loading…",
  },
  ta: {
    kicker: "ஓட்ட ஆய்வகம்", title: "நேரம் எப்போது மறக்கிறது?",
    desc: "கவனம், மகிழ்ச்சி, சவால் பொருத்தத்தைப் பதியுங்கள். ஒன்றிப்பு தொழிலைத் தீர்மானிக்காது — சூழலைக் குறிக்கும்.",
    add: "செயலைச் சேர்", activity: "செயலின் பெயர்", activityPh: "எ.கா. வரைதல், சமையல்",
    date: "தேதி", time: "நேரம்", morning: "காலை", afternoon: "மதியம்", evening: "மாலை", night: "இரவு",
    duration: "கால அளவு (நிமிடம்)", setting: "சூழல்", notes: "குறிப்புகள்",
    sliders: [["focus", "கவனம்"], ["enjoyment", "மகிழ்ச்சி"], ["difficulty", "சவால்"], ["confidence", "நம்பிக்கை"]] as Array<[string, string]>,
    errName: "செயலுக்குச் சிறு பெயர் கொடுங்கள்.", errDate: "தேதியைத் தேர்ந்தெடுங்கள்.",
    addEntry: "சேர்", pattern: "உங்கள் வடிவம்", avg: "சராசரி ஒன்றிப்பு", total: "மொத்தம்",
    week: "இந்த வாரம்", common: "பொதுச் சூழல்", engaging: "அதிக ஈடுபாடு:",
    advice: "அதிக மதிப்பெண் தந்ததை மேலும் செய்யுங்கள்; ஒரு தடையைக் குறையுங்கள்.",
    export: "JSON ஏற்றுமதி", del: "நீக்கு", confirmDel: "இந்தப் பதிவை நீக்கவா?",
    emptyT: "இன்னும் ஒன்றிப்புப் பதிவுகள் இல்லை", emptyD: "மூழ்கிய ஒரு செயலைப் பதியுங்கள். இரண்டு நிமிடம் போதும்.",
    note: "ஒன்றிப்பு நல்ல சூழலைக் குறிக்கும் — விதியையோ வேலையையோ அல்ல.", loading: "ஏற்றுகிறது…",
  },
};

export default function FlowPage() {
  const { prefs } = usePrefs();
  const s = prefs.lang === "ta" ? STR.ta : STR.en;
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
    if (form.activity.trim().length < 2) { setError(s.errName); return; }
    if (!form.date) { setError(s.errDate); return; }
    setError("");
    const score = flowScore(form.focus, form.enjoyment, form.difficulty, form.confidence);
    setEntries((es) => [{ id: uid("flow"), ...form, activity: form.activity.trim(), notes: form.notes.trim(), flowScore: score }, ...es]);
    setForm((f) => ({ ...f, activity: "", notes: "" }));
  };

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>{s.loading}</p></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker={s.kicker} title={s.title} desc={s.desc} />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="min-w-0 lg:col-span-2">
          <h2 className="font-bold">{s.add}</h2>
          <label className="mt-3 block text-sm">{s.activity}<input value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} className="mt-1 w-full min-w-0 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder={s.activityPh} /></label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="min-w-0 text-sm">{s.date}<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
            <label className="min-w-0 text-sm">{s.time}<select value={form.timeOfDay} onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="morning">{s.morning}</option><option value="afternoon">{s.afternoon}</option><option value="evening">{s.evening}</option><option value="night">{s.night}</option></select></label>
          </div>
          <label className="mt-2 block text-sm">{s.duration}<input type="number" min={1} max={1440} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {s.sliders.map(([k, label]) => (
            <label key={k} className="mt-2 block text-sm">{label} (1–5)<input type="range" min={1} max={5} value={(form as unknown as Record<string, number>)[k]} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} className="mt-1 w-full" aria-label={label} /><span className="font-bold">{(form as unknown as Record<string, number>)[k]}</span></label>
          ))}
          <fieldset className="mt-2"><legend className="text-sm">{s.setting}</legend><div className="mt-1 flex flex-wrap gap-2">{SETTINGS.map((v) => <button key={v} type="button" onClick={() => setForm({ ...form, setting: v })} aria-pressed={form.setting === v} className={`rounded-full border px-3 py-1.5 text-sm ${form.setting === v ? "border-imperial bg-imperial/15" : "border-[var(--border)]"}`}>{v}</button>)}</div></fieldset>
          <label className="mt-2 block text-sm">{s.notes}<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
          <div className="mt-3"><Button data-testid="flow-add-entry" onClick={add}>{s.addEntry}</Button></div>
        </Card>
        <div className="min-w-0 lg:col-span-3">
          {stats ? (
            <div className="grid gap-4">
              <Card><h2 className="font-bold">{s.pattern}</h2>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.avg}</dt><dd className="text-xl font-bold">{stats.avg}/5</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.total}</dt><dd className="text-xl font-bold">{stats.total}</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.week}</dt><dd className="text-xl font-bold">{stats.weekly}</dd></div>
                  <div className="rounded-xl bg-black/[0.03] p-3 text-center dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.common}</dt><dd className="break-words text-xl font-bold">{stats.commonSetting}</dd></div>
                </dl>
                <p className="mt-3 break-words text-sm"><strong>{s.engaging}</strong> {stats.top.map((t) => `${t.activity} (${t.flowScore})`).join(" · ")}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{s.advice}</p>
                <div className="mt-3"><button className="text-sm underline" onClick={() => downloadJSON("flow-entries.json", entries)}>{s.export}</button></div>
              </Card>
              <ul className="grid gap-2">
                {entries.map((e) => (
                  <li key={e.id} className="royal-card flex items-center justify-between gap-3 overflow-x-auto p-4">
                    <div className="min-w-0"><p className="break-words font-semibold">{e.activity} <span className="ml-2 whitespace-nowrap rounded-full bg-imperial/15 px-2 py-0.5 text-xs font-bold">{e.flowScore}/5</span></p>
                    <p className="break-words text-xs text-[var(--muted)]">{e.date} · {e.timeOfDay} · {e.durationMin} min · {e.setting} · f{e.focus} j{e.enjoyment} d{e.difficulty} c{e.confidence}</p></div>
                    <button className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm" onClick={() => { if (confirm(s.confirmDel)) setEntries((es) => es.filter((x) => x.id !== e.id)); }}>{s.del}</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState title={s.emptyT} desc={s.emptyD} />
          )}
          <div className="mt-4"><Notice>{s.note}</Notice></div>
        </div>
      </div>
    </div>
  );
}
