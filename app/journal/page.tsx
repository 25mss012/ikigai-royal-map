"use client";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, CRISIS_NOTICE_EN } from "@/lib/constants";
import { asArray, getJSON, setJSON } from "@/lib/storage";
import { download, downloadJSON } from "@/lib/export-data";
import { uid, todayISO } from "@/lib/utils";
import { Button, Card, EmptyState, Notice, SectionHeading } from "@/components/ui";
import type { JournalEntry } from "@/types";

const CRISIS_WORDS = ["suicide", "kill myself", "self-harm", "end my life", "want to die", "தற்கொலை"];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ date: todayISO(), mood: 3, energy: 3, purpose: 3, text: "", tags: "", activity: "", gratitude: "", challenge: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [error, setError] = useState("");
  const [showCrisis, setShowCrisis] = useState(false);

  useEffect(() => { setEntries(asArray<JournalEntry>(getJSON<unknown>(STORAGE_KEYS.journal, []))); setLoaded(true); }, []);
  useEffect(() => { if (loaded) setJSON(STORAGE_KEYS.journal, entries); }, [entries, loaded]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const q = query.toLowerCase();
      const hitQ = !q || e.text.toLowerCase().includes(q) || (e.gratitude ?? "").toLowerCase().includes(q);
      const hitT = !tagFilter || e.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
      return hitQ && hitT;
    });
  }, [entries, query, tagFilter]);

  const allTags = useMemo(() => Array.from(new Set(entries.flatMap((e) => e.tags))).slice(0, 20), [entries]);

  const save = () => {
    if (form.text.trim().length < 1) { setError("Write at least a sentence."); return; }
    setError("");
    const low = form.text.toLowerCase();
    if (CRISIS_WORDS.some((w) => low.includes(w))) setShowCrisis(true);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10);
    if (editing) {
      setEntries((es) => es.map((e) => (e.id === editing ? { ...e, ...form, text: form.text.trim(), tags, updatedAt: new Date().toISOString() } : e)));
      setEditing(null);
    } else {
      setEntries((es) => [{ id: uid("j"), ...form, text: form.text.trim(), tags, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...es]);
    }
    setForm({ date: todayISO(), mood: 3, energy: 3, purpose: 3, text: "", tags: "", activity: "", gratitude: "", challenge: "" });
  };

  const exportMd = () => {
    const md = entries.map((e) => `## ${e.date}\nMood ${e.mood}/5 · Energy ${e.energy}/5 · Purpose ${e.purpose}/5\nTags: ${e.tags.join(", ")}\n\n${e.text}\n${e.gratitude ? `\nGrateful: ${e.gratitude}\n` : ""}${e.challenge ? `\nChallenge: ${e.challenge}\n` : ""}\n---\n`).join("\n");
    download("ikigai-journal.md", md || "# Empty journal", "text/markdown");
  };

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>Loading…</p></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker="Private journal" title="A few honest lines" desc="No account. Stored in this browser only." />
      <Notice>Your journal is stored in this browser. Clearing browser data or changing devices may remove it unless you export it.</Notice>
      {showCrisis && <div className="mt-3"><Notice tone="warn">{CRISIS_NOTICE_EN}</Notice></div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="font-bold">{editing ? "Edit entry" : "New entry"}</h2>
          <label className="mt-3 block text-sm">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {[["mood", "Mood"], ["energy", "Energy"], ["purpose", "Purpose"]].map(([k, label]) => (
            <label key={k} className="mt-2 block text-sm">{label} (1–5)<input type="range" min={1} max={5} value={(form as unknown as Record<string, number>)[k]} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} className="mt-1 w-full" aria-label={label} /></label>
          ))}
          <label className="mt-2 block text-sm">Reflection<textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={5} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder="What mattered today?" /></label>
          <label className="mt-2 block text-sm">Tags (comma separated)<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder="calm, family, work" /></label>
          <label className="mt-2 block text-sm">Related activity (optional)<input value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">Gratitude (optional)<input value={form.gratitude} onChange={(e) => setForm({ ...form, gratitude: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">Challenge (optional)<input value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
          <div className="mt-3 flex gap-2"><Button data-testid="journal-save" onClick={save}>{editing ? "Update" : "Save entry"}</Button>{editing && <Button variant="secondary" onClick={() => { setEditing(null); setForm({ date: todayISO(), mood: 3, energy: 3, purpose: 3, text: "", tags: "", activity: "", gratitude: "", challenge: "" }); }}>Cancel</Button>}</div>
        </Card>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reflections…" aria-label="Search reflections" className="min-w-[200px] flex-1 rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-sm" />
            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} aria-label="Filter by tag" className="rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-sm">
              <option value="">All tags</option>{allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="mt-2 flex gap-3 text-sm">
            <button className="underline" onClick={() => downloadJSON("ikigai-journal.json", entries)}>Export JSON</button>
            <button className="underline" onClick={exportMd}>Export Markdown</button>
            <button className="underline text-error" onClick={() => { if (confirm("Delete ALL journal entries? This cannot be undone.")) setEntries([]); }}>Clear all</button>
          </div>
          {filtered.length === 0 ? (
            <div className="mt-4"><EmptyState title="No entries yet" desc="Your journey begins with one small reflection. Try one five-minute note." /></div>
          ) : (
            <ul className="mt-4 grid gap-3">
              {filtered.map((e) => (
                <li key={e.id} className="royal-card p-5">
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>{e.date} · ♥{e.mood} ⚡{e.energy} ✦{e.purpose}</span><span>{e.tags.join(" · ")}</span></div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{e.text}</p>
                  {e.gratitude && <p className="mt-1 text-sm">Grateful: {e.gratitude}</p>}
                  {e.challenge && <p className="mt-1 text-sm text-[var(--muted)]">Challenge: {e.challenge}</p>}
                  <div className="mt-3 flex gap-2 text-sm">
                    <button className="underline" onClick={() => { setEditing(e.id); setForm({ date: e.date, mood: e.mood, energy: e.energy, purpose: e.purpose, text: e.text, tags: e.tags.join(", "), activity: e.activity ?? "", gratitude: e.gratitude ?? "", challenge: e.challenge ?? "" }); window.scrollTo({ top: 0 }); }}>Edit</button>
                    <button className="underline text-error" onClick={() => { if (confirm("Delete this entry?")) setEntries((es) => es.filter((x) => x.id !== e.id)); }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
