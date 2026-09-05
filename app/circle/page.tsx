"use client";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, getJSON, setJSON } from "@/lib/storage";
import { uid } from "@/lib/utils";
import { CIRCLE_KINDS } from "@/data/reflection-prompts";
import { Button, Card, EmptyState, SectionHeading, Notice } from "@/components/ui";
import type { CircleEntry } from "@/types";

export default function CirclePage() {
  const [entries, setEntries] = useState<CircleEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ label: "", kind: "Friend", supportReceived: "", supportGiven: "", lastConnection: "", nextIntention: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const blank = { label: "", kind: "Friend", supportReceived: "", supportGiven: "", lastConnection: "", nextIntention: "" };

  useEffect(() => { setEntries(asArray<CircleEntry>(getJSON<unknown>(STORAGE_KEYS.circle, []))); setLoaded(true); }, []);
  useEffect(() => { if (loaded) setJSON(STORAGE_KEYS.circle, entries); }, [entries, loaded]);

  const add = () => {
    if (!form.label.trim()) { setError("Add a name or label."); return; }
    if (!editing && entries.length >= 5) { setError("Keep your circle to five steady entries. Remove one to add another."); return; }
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

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>Loading…</p></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading kicker="Support circle" title="Held by a few, not by many" desc="Up to five: people, groups, practices, even nature. Private — no profiles, no network." />
      <Notice>Purpose is steadier with relationships. Reciprocity matters: how they support you, and how you support them.</Notice>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">{editing ? "Edit circle entry" : `Add to your circle (${entries.length}/5)`}</h2>
          <label className="mt-3 block text-sm">Name or label<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder="e.g. Meena, walking group, sea air" /></label>
          <label className="mt-2 block text-sm">Type<select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2">{CIRCLE_KINDS.map((k) => <option key={k}>{k}</option>)}<option>Other</option></select></label>
          <label className="mt-2 block text-sm">How they support me<input value={form.supportReceived} onChange={(e) => setForm({ ...form, supportReceived: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">How I support them<input value={form.supportGiven} onChange={(e) => setForm({ ...form, supportGiven: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">Last meaningful connection<input type="date" value={form.lastConnection} onChange={(e) => setForm({ ...form, lastConnection: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" /></label>
          <label className="mt-2 block text-sm">Next intention<input value={form.nextIntention} onChange={(e) => setForm({ ...form, nextIntention: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2" placeholder="e.g. call on Sunday" /></label>
          {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
          <div className="mt-3 flex gap-2"><Button data-testid="circle-add" onClick={add}>{editing ? "Update entry" : "Add"}</Button>{editing && <Button variant="secondary" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</Button>}</div>
        </Card>
        <div>
          {entries.length === 0 ? <EmptyState title="Your circle is empty" desc="You do not need to know your purpose before you begin. Start with one steady connection." />
          : <ul className="grid gap-3">{entries.map((c) => (
            <li key={c.id} className="royal-card p-5">
              <div className="flex items-center justify-between"><p className="font-bold">{c.label}</p><span className="rounded-full bg-jade-light px-2 py-0.5 text-xs text-jade-dark dark:bg-white/10 dark:text-white">{c.kind}</span></div>
              {c.supportReceived && <p className="mt-1 text-sm">They give: {c.supportReceived}</p>}
              {c.supportGiven && <p className="text-sm">I give: {c.supportGiven}</p>}
              {(c.lastConnection || c.nextIntention) && <p className="mt-1 text-xs text-[var(--muted)]">Last: {c.lastConnection || "—"} · Next: {c.nextIntention || "—"}</p>}
              <div className="mt-2 flex gap-3 text-sm">
                <button className="underline" onClick={() => startEdit(c)}>Edit</button>
                <button className="text-error underline" onClick={() => { if (confirm("Remove this entry?")) setEntries((es) => es.filter((x) => x.id !== c.id)); }}>Remove</button>
              </div>
            </li>))}</ul>}
        </div>
      </div>
    </div>
  );
}
