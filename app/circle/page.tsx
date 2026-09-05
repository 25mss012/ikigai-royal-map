"use client";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, getJSON, setJSON } from "@/lib/storage";
import { uid } from "@/lib/utils";
import { usePrefs } from "@/components/providers";
import { Button, Card, EmptyState, SectionHeading, Notice } from "@/components/ui";
import { PrintHeader } from "@/components/print-header";
import type { CircleEntry } from "@/types";

const KINDS = [
  { en: "Family", ta: "குடும்பம்" }, { en: "Friend", ta: "நண்பர்" },
  { en: "Mentor / Teacher", ta: "வழிகாட்டி / ஆசிரியர்" }, { en: "Group / Community", ta: "குழு / சமூகம்" },
  { en: "Volunteer organisation", ta: "தன்னார்வ அமைப்பு" }, { en: "Creative community", ta: "படைப்புக் குழு" },
  { en: "Spiritual practice", ta: "ஆன்மிகப் பயிற்சி" }, { en: "Nature", ta: "இயற்கை" }, { en: "Other", ta: "மற்றது" },
];

const STR = {
  en: {
    kicker: "Support circle", title: "Held by a few, not by many",
    desc: "Up to five: people, groups, practices, even nature. Private — no profiles, no network.",
    note: "Purpose is steadier with relationships. Reciprocity matters: how they support you, and how you support them.",
    addH: (n: number) => `Add to your circle (${n}/5)`, editH: "Edit circle entry",
    label: "Name or label", labelPh: "e.g. Meena, walking group, sea air", type: "Type",
    recv: "How they support me", give: "How I support them", last: "Last meaningful connection", next: "Next intention", nextPh: "e.g. call on Sunday",
    errName: "Add a name or label.", errFull: "Keep your circle to five steady entries. Remove one to add another.",
    add: "Add", update: "Update entry", cancel: "Cancel",
    emptyT: "Your circle is empty", emptyD: "You do not need to know your purpose before you begin. Start with one steady connection.",
    theyGive: "They give:", iGive: "I give:", lastL: "Last:", nextL: "Next:",
    edit: "Edit", remove: "Remove", confirmRemove: "Remove this entry?", loading: "Loading…",
  },
  ta: {
    kicker: "துணை வட்டம்", title: "சிலரால் தாங்கப்படுவது",
    desc: "ஐந்து வரை: மனிதர், குழுக்கள், பயிற்சிகள், இயற்கைகூட. தனிப்பட்டது — சுயவிவரம், வலையமைப்பு இல்லை.",
    note: "உறவுகளுடன் நோக்கம் நிலையாகும். பரிமாற்றம் முக்கியம்: அவர்கள் உங்களுக்கு எப்படி, நீங்கள் அவர்களுக்கு எப்படி.",
    addH: (n: number) => `உங்கள் வட்டத்தில் சேர் (${n}/5)`, editH: "வட்டப் பதிவைத் திருத்து",
    label: "பெயர் அல்லது குறிப்பு", labelPh: "எ.கா. மீனா, நடை குழு, கடற்காற்று", type: "வகை",
    recv: "அவர்கள் எனக்கு எப்படி உதவுகிறார்கள்", give: "நான் அவர்களுக்கு எப்படி உதவுகிறேன்", last: "கடைசி அர்த்தமுள்ள தொடர்பு", next: "அடுத்த எண்ணம்", nextPh: "எ.கா. ஞாயிறு அழைக்க",
    errName: "பெயர் அல்லது குறிப்பு கொடுங்கள்.", errFull: "ஐந்து நிலையான பதிவுகள் வரை. ஒன்றை நீக்கிவிட்டு மற்றொன்று சேர்க்கவும்.",
    add: "சேர்", update: "பதிவைப் புதுப்பி", cancel: "ரத்து",
    emptyT: "உங்கள் வட்டம் காலியாக உள்ளது", emptyD: "நோக்கம் தெரிய வேண்டியதில்லை. ஒரு நிலையான தொடர்பில் தொடங்குங்கள்.",
    theyGive: "அவர்கள் தருவது:", iGive: "நான் தருவது:", lastL: "கடைசி:", nextL: "அடுத்து:",
    edit: "திருத்து", remove: "நீக்கு", confirmRemove: "இந்தப் பதிவை நீக்கவா?", loading: "ஏற்றுகிறது…",
  },
};

export default function CirclePage() {
  const { prefs } = usePrefs();
  const ta = prefs.lang === "ta";
  const s = ta ? STR.ta : STR.en;
  const [entries, setEntries] = useState<CircleEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ label: "", kind: "Friend", supportReceived: "", supportGiven: "", lastConnection: "", nextIntention: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const blank = { label: "", kind: "Friend", supportReceived: "", supportGiven: "", lastConnection: "", nextIntention: "" };

  useEffect(() => { setEntries(asArray<CircleEntry>(getJSON<unknown>(STORAGE_KEYS.circle, []))); setLoaded(true); }, []);
  useEffect(() => { if (loaded) setJSON(STORAGE_KEYS.circle, entries); }, [entries, loaded]);

  const kindTa = (en: string) => KINDS.find((k) => k.en === en)?.ta ?? en;

  const add = () => {
    if (!form.label.trim()) { setError(s.errName); return; }
    if (!editing && entries.length >= 5) { setError(s.errFull); return; }
    setError("");
    if (editing) {
      setEntries((es) => es.map((x) => (x.id === editing ? { ...x, ...form, label: form.label.trim() } : x)));
      setEditing(null);
    } else {
      setEntries((es) => [...es, { id: uid("c"), ...form, label: form.label.trim() }]);
    }
    setForm(blank);
  };

  const startEdit = (c: CircleEntry) => {
    setEditing(c.id);
    setError("");
    setForm({ label: c.label, kind: c.kind, supportReceived: c.supportReceived, supportGiven: c.supportGiven, lastConnection: c.lastConnection, nextIntention: c.nextIntention });
    window.scrollTo({ top: 0 });
  };

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>{s.loading}</p></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PrintHeader titleEn="Support circle" titleTa="துணை வட்டம்" />
      <SectionHeading kicker={s.kicker} title={s.title} desc={s.desc} />
      <Notice>{s.note}</Notice>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <h2 className="font-bold">{editing ? s.editH : s.addH(entries.length)}</h2>
          <label className="mt-3 block text-sm">{s.label}<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder={s.labelPh} /></label>
          <label className="mt-2 block text-sm">{s.type}<select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2">{KINDS.map((k) => <option key={k.en} value={k.en}>{ta ? k.ta : k.en}</option>)}</select></label>
          <label className="mt-2 block text-sm">{s.recv}<input value={form.supportReceived} onChange={(e) => setForm({ ...form, supportReceived: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">{s.give}<input value={form.supportGiven} onChange={(e) => setForm({ ...form, supportGiven: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">{s.last}<input type="date" value={form.lastConnection} onChange={(e) => setForm({ ...form, lastConnection: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">{s.next}<input value={form.nextIntention} onChange={(e) => setForm({ ...form, nextIntention: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder={s.nextPh} /></label>
          {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2"><Button data-testid="circle-add" onClick={add}>{editing ? s.update : s.add}</Button>{editing && <Button variant="secondary" onClick={() => { setEditing(null); setForm(blank); }}>{s.cancel}</Button>}</div>
        </Card>
        <div className="min-w-0">
          {entries.length === 0 ? <EmptyState title={s.emptyT} desc={s.emptyD} />
          : <ul className="grid gap-3">{entries.map((c) => (
            <li key={c.id} className="royal-card min-w-0 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="break-words font-bold">{c.label}</p><span className="rounded-full bg-jade-light px-2 py-0.5 text-xs text-jade-dark dark:bg-white/10 dark:text-white">{ta ? kindTa(c.kind) : c.kind}</span></div>
              {c.supportReceived && <p className="mt-1 break-words text-sm">{s.theyGive} {c.supportReceived}</p>}
              {c.supportGiven && <p className="break-words text-sm">{s.iGive} {c.supportGiven}</p>}
              {(c.lastConnection || c.nextIntention) && <p className="mt-1 break-words text-xs text-[var(--muted)]">{s.lastL} {c.lastConnection || "—"} · {s.nextL} {c.nextIntention || "—"}</p>}
              <div className="mt-2 flex gap-3 text-sm">
                <button className="underline" onClick={() => startEdit(c)}>{s.edit}</button>
                <button className="text-error underline" onClick={() => { if (confirm(s.confirmRemove)) setEntries((es) => es.filter((x) => x.id !== c.id)); }}>{s.remove}</button>
              </div>
            </li>))}</ul>}
        </div>
      </div>
    </div>
  );
}
