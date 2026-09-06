"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS } from "@/lib/constants";
import { asArray, clearAllIkigai, getJSON, getValidated, isAssessmentResultLike, storageAvailable } from "@/lib/storage";
import { collectExport } from "@/lib/portability";
import { ImportDialog } from "@/components/import-dialog";
import { DemoEntryButton } from "@/components/demo";
import { usePrefs } from "@/components/providers";
import { planProgress } from "@/data/plan-templates";
import { REFLECTION_PROMPTS_EN, REFLECTION_PROMPTS_TA } from "@/data/reflection-prompts";
import { downloadJSON } from "@/lib/export-data";
import { Card, SectionHeading, ProgressBar, EmptyState } from "@/components/ui";
import type { AssessmentResult, FlowEntry, JournalEntry, PlanDay, CircleEntry } from "@/types";

const STR = {
  en: {
    kicker: "Dashboard", desc: "A calm overview. Useful even when empty.",
    greetM: "Good morning", greetA: "Good afternoon", greetE: "Good evening", small: "Small steps count.",
    b1: "Your journey begins with one small reflection.", b2: "You do not need to know your purpose before you begin.", b3: "Try one five-minute experiment.",
    reflection: "Reflection", noAssess: "No assessment yet.", startAssess: "Start assessment", openResult: "Open result",
    complete: "complete", provisional: "provisional",
    prompt: "Today’s prompt", write5: "Write 5 minutes", planH: "Plan", genPlan: "Generate 30-day plan",
    recent: "Recent life", journal: "Journal", flow: "Flow", circle: "Circle",
    quick: "Quick actions", learn3: "Learn 3 min", logFlow: "Log flow",
    privacy: "Privacy status", stored: "Stored locally in this browser.", noAccount: "No account required.",
    noTracking: "No tracking configured.", exportOk: "Export available.", deleteOk: "Delete available.",
    exportAll: "Export all data", deleteAll: "Delete all data", confirmDelete: "Delete ALL local data? This cannot be undone. Export first if needed.",
    emptyT: "Nothing here yet — and that is fine", emptyD: "Begin with one essay, one question, or one five-minute note.", readOne: "Read one essay",
    loading: "Loading…", done: "done",
  },
  ta: {
    kicker: "பலகை", desc: "அமைதியான மேலோட்டம். காலியாக இருந்தாலும் பயனுள்ளது.",
    greetM: "காலை வணக்கம்", greetA: "மதிய வணக்கம்", greetE: "மாலை வணக்கம்", small: "சிறு அடிகள் கணக்கு.",
    b1: "உங்கள் பயணம் ஒரு சிறு சிந்தனையில் தொடங்கும்.", b2: "நோக்கம் தெரியாமலே தொடங்கலாம்.", b3: "5 நிமிடச் சோதனை முயலுங்கள்.",
    reflection: "சிந்தனை", noAssess: "இன்னும் மதிப்பீடு இல்லை.", startAssess: "மதிப்பீட்டைத் தொடங்கு", openResult: "முடிவைத் திற",
    complete: "நிறைவு", provisional: "தற்காலிகம்",
    prompt: "இன்றைய கேள்வி", write5: "5 நிமிடம் எழுதுக", planH: "திட்டம்", genPlan: "30-நாள் திட்டம் உருவாக்கு",
    recent: "சமீப வாழ்க்கை", journal: "நாட்குறிப்பு", flow: "ஒன்றிப்பு", circle: "வட்டம்",
    quick: "விரைவுச் செயல்கள்", learn3: "3 நிமிடம் கற்க", logFlow: "ஒன்றிப்பு பதி",
    privacy: "தனியுரிமை நிலை", stored: "இந்த உலாவியில் உள்ளூரில் சேமிப்பு.", noAccount: "கணக்கு தேவையில்லை.",
    noTracking: "கண்காணிப்பு இல்லை.", exportOk: "ஏற்றுமதி உண்டு.", deleteOk: "நீக்கம் உண்டு.",
    exportAll: "அனைத்துத் தரவையும் ஏற்றுமதி", deleteAll: "அனைத்துத் தரவையும் நீக்கு", confirmDelete: "அனைத்து உள்ளூர் தரவையும் நீக்கவா? மீட்க முடியாது. முதலில் ஏற்றுமதி செய்க.",
    emptyT: "இங்கு இன்னும் எதுவும் இல்லை — பரவாயில்லை", emptyD: "ஒரு கட்டுரை, கேள்வி, 5 நிமிடக் குறிப்பில் தொடங்குங்கள்.", readOne: "ஒரு கட்டுரை படி",
    loading: "ஏற்றுகிறது…", done: "முடிந்தது",
  },
};

export default function DashboardPage() {
  const { prefs } = usePrefs();
  const ta = prefs.lang === "ta";
  const s = ta ? STR.ta : STR.en;
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [flow, setFlow] = useState<FlowEntry[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [plan, setPlan] = useState<PlanDay[] | null>(null);
  const [circle, setCircle] = useState<CircleEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [privateOk, setPrivateOk] = useState(true);

  function load() {
    setResult(getValidated<AssessmentResult | null>(STORAGE_KEYS.result, null, (v): v is AssessmentResult | null => v === null || isAssessmentResultLike(v)));
    setFlow(asArray<FlowEntry>(getJSON<unknown>(STORAGE_KEYS.flow, [])));
    setJournal(asArray<JournalEntry>(getJSON<unknown>(STORAGE_KEYS.journal, [])));
    setPlan(getValidated<PlanDay[] | null>(STORAGE_KEYS.plan, null, (v): v is PlanDay[] | null => v === null || Array.isArray(v)));
    setCircle(asArray<CircleEntry>(getJSON<unknown>(STORAGE_KEYS.circle, [])));
    setPrivateOk(storageAvailable());
    setReady(true);
  }

  useEffect(() => { load(); }, []);

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-12"><p>{s.loading}</p></div>;
  const hasAny = result || flow.length || journal.length || plan || circle.length;
  const pp = plan ? planProgress(plan) : null;
  const prompts = ta ? REFLECTION_PROMPTS_TA : REFLECTION_PROMPTS_EN;
  const prompt = prompts[new Date().getDate() % prompts.length];
  const hour = new Date().getHours();
  const greet = hour < 12 ? s.greetM : hour < 17 ? s.greetA : s.greetE;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading kicker={s.kicker} title={`${greet}. ${s.small}`} desc={s.desc} />
      {!hasAny && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card><p className="font-semibold">{s.b1}</p></Card>
          <Card><p className="font-semibold">{s.b2}</p></Card>
          <Card><p className="font-semibold">{s.b3}</p></Card>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0">
          <h2 className="font-bold">{s.reflection}</h2>
          {result ? (<><p className="mt-1 text-3xl font-bold">{result.overall ?? "—"}%</p><p className="break-words text-sm text-[var(--muted)]">{result.archetype} · {result.completionPct}% {s.complete}{result.provisional ? ` · ${s.provisional}` : ""}</p><Link href="/assessment/results" className="mt-2 inline-block text-sm underline">{s.openResult}</Link></>)
          : (<><p className="mt-1 text-sm text-[var(--muted)]">{s.noAssess}</p><Link href="/assessment" className="mt-2 inline-block rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{s.startAssess}</Link></>)}
        </Card>
        <Card className="min-w-0">
          <h2 className="font-bold">{s.prompt}</h2>
          <p className="mt-1 break-words text-sm italic">“{prompt}”</p>
          <Link href="/journal" className="mt-2 inline-block text-sm underline">{s.write5}</Link>
          <h2 className="mt-4 font-bold">{s.planH}</h2>
          {pp ? (<div className="mt-1"><ProgressBar value={pp.pct} label={`Day ${pp.currentDay}/30 · ${pp.done} ${s.done}`} /></div>)
          : (<Link href="/plan" className="text-sm underline">{s.genPlan}</Link>)}
        </Card>
        <Card className="min-w-0">
          <h2 className="font-bold">{s.recent}</h2>
          <p className="mt-1 break-words text-sm">{s.journal}: {journal[0] ? `${journal[0].date} — ${journal[0].text.slice(0, 60)}…` : "—"}</p>
          <p className="mt-1 break-words text-sm">{s.flow}: {flow[0] ? `${flow[0].activity} (${flow[0].flowScore}/5)` : "—"}</p>
          <p className="mt-1 break-words text-sm">{s.circle}: {circle.length ? `${circle.length}` : "—"}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm"><Link href="/journal" className="underline">{s.journal}</Link><Link href="/flow" className="underline">{s.flow}</Link><Link href="/circle" className="underline">{s.circle}</Link></div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <h2 className="font-bold">{s.quick}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Link href="/learn" className="rounded-full border border-[var(--border)] px-4 py-2">{s.learn3}</Link>
            <Link href="/flow" className="rounded-full border border-[var(--border)] px-4 py-2">{s.logFlow}</Link>
            <Link href="/journal" className="rounded-full border border-[var(--border)] px-4 py-2">{s.journal}</Link>
            <Link href="/circle" className="rounded-full border border-[var(--border)] px-4 py-2">{s.circle}</Link>
          </div>
        </Card>
        <Card className="min-w-0" data-testid="privacy-status">
          <h2 className="font-bold">{s.privacy}</h2>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <li>✓ {s.stored}</li>
            <li>✓ {s.noAccount}</li>
            <li>✓ {s.noTracking}</li>
            <li>✓ {s.exportOk} · ✓ {s.deleteOk}{privateOk ? "" : ta ? " (உலாவி சேமிப்பு தடுக்கப்பட்டுள்ளது)" : " (browser storage blocked)"}</li>
          </ul>
          <div className="mt-3">
            <ImportDialog onImported={load} />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button data-testid="export-all" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm" onClick={() => downloadJSON("ikigai-export.json", collectExport())} aria-label={s.exportAll}>{s.exportAll}</button>
            <button data-testid="delete-all" className="rounded-full border border-error px-4 py-2 text-sm text-error" onClick={() => { if (confirm(s.confirmDelete)) { clearAllIkigai(); location.reload(); } }}>{s.deleteAll}</button>
          </div>
        </Card>
      </div>
      {!hasAny && <div className="mt-4"><EmptyState title={s.emptyT} desc={s.emptyD} action={<span className="inline-flex flex-wrap justify-center gap-2"><Link href="/learn" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{s.readOne}</Link><DemoEntryButton /></span>} /></div>}
    </div>
  );
}
