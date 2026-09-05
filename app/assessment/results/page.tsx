"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS, DIMENSIONS } from "@/lib/constants";
import { getValidated, isAssessmentResultLike, removeKey } from "@/lib/storage";
import { experimentsFor, promptsFor } from "@/lib/recommendations";
import { downloadJSON } from "@/lib/export-data";
import { usePrefs } from "@/components/providers";
import { Button, Card, EmptyState, Notice, SectionHeading } from "@/components/ui";
import { IkigaiWheel } from "@/components/ikigai-wheel";
import { RadarChartView } from "@/components/radar-chart";
import { PrintHeader } from "@/components/print-header";
import type { AssessmentResult } from "@/types";

const ARCHETYPE_TA: Record<string, string> = {
  "The Curious Builder": "ஆர்வமுள்ள உருவாக்குநர்",
  "The Caring Guide": "அக்கறையுள்ள வழிகாட்டி",
  "The Quiet Creator": "அமைதியான படைப்பாளர்",
  "The Purposeful Learner": "நோக்கமுள்ள கற்பவர்",
  "The Community Catalyst": "சமூக ஊக்கி",
  "The Practical Explorer": "நடைமுறை ஆராய்வாளர்",
  "The Reflective Strategist": "சிந்தனைமிகு திட்டமிடுபவர்",
  "The Balanced Beginner": "சமநிலைத் தொடக்கநிலையாளர்",
};

const STR = {
  en: {
    loading: "Loading…", noT: "No result yet",
    noD: "Take the 40-question assessment first. It takes about 10 minutes and saves as you go.",
    start: "Start assessment", prov: "Provisional · current snapshot", snap: "Current snapshot",
    tempLabel: "This is a temporary pattern based on your answers, not a permanent label.",
    dims: "Your dimensions", overall: "Overall", balance: "Balance", done: "Done",
    strongest: "Strongest:", growth: "Growth:", map: "Your Ikigai map", chart: "Pattern chart",
    exp: "Three small experiments", expNote: "Small · low-cost · time-bound · reversible · observable.",
    prompts: "Reflection prompts", limits: "Limitations",
    limitsD: "This is a reflection indicator — not IQ, personality type, diagnosis, or destiny. It reflects today’s answers only. Purpose can change; you can hold several at once.",
    plan: "Start 30-day plan", flow: "Open Flow Lab", journal: "Write journal entry",
    print: "Print", export: "Export JSON", reset: "Reset", confirmReset: "Delete this result?",
    share: "Share-safe summary", shareNone: "No journal text included.",
  },
  ta: {
    loading: "ஏற்றுகிறது…", noT: "இன்னும் முடிவு இல்லை",
    noD: "முதலில் 40-கேள்வி மதிப்பீட்டை எடுங்கள். சுமார் 10 நிமிடம்; சேமித்துக்கொண்டே செல்லும்.",
    start: "மதிப்பீட்டைத் தொடங்கு", prov: "தற்காலிகம் · தற்போதைய பார்வை", snap: "தற்போதைய பார்வை",
    tempLabel: "இது உங்கள் பதில்களின் தற்காலிக வடிவம், நிரந்தர முத்திரை அல்ல.",
    dims: "உங்கள் பரிமாணங்கள்", overall: "ஒட்டுமொத்தம்", balance: "சமநிலை", done: "நிறைவு",
    strongest: "வலுவானது:", growth: "வளர்ச்சி:", map: "உங்கள் இகிகை வரைபடம்", chart: "வடிவ விளக்கப்படம்",
    exp: "மூன்று சிறு சோதனைகள்", expNote: "சிறியது · குறைந்த செலவு · காலவரம்பு · மீளக்கூடியது · கவனிக்கத்தக்கது.",
    prompts: "சிந்தனைக் கேள்விகள்", limits: "வரம்புகள்",
    limitsD: "இது சிந்தனைக் குறிகாட்டி — நுண்ணறிவு, ஆளுமை வகை, நோயறிதல், விதி அல்ல. இன்றைய பதில்களை மட்டும் பிரதிபலிக்கும். நோக்கம் மாறலாம்; பல நோக்கங்கள் இருக்கலாம்.",
    plan: "30-நாள் திட்டம் தொடங்கு", flow: "ஓட்ட ஆய்வகம் திற", journal: "நாட்குறிப்பு எழுதுக",
    print: "அச்சிடு", export: "JSON ஏற்றுமதி", reset: "மீட்டமை", confirmReset: "இந்த முடிவை நீக்கவா?",
    share: "பகிரப் பாதுகாப்பான சுருக்கம்", shareNone: "நாட்குறிப்பு உரை சேர்க்கப்படவில்லை.",
  },
};

export default function ResultsPage() {
  const { prefs } = usePrefs();
  const lang = prefs.lang;
  const ta = lang === "ta";
  const s = ta ? STR.ta : STR.en;
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loaded = getValidated<AssessmentResult | null>(STORAGE_KEYS.result, null, (v): v is AssessmentResult | null => v === null || isAssessmentResultLike(v));
    setResult(loaded);
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-12"><p>{s.loading}</p></div>;
  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState title={s.noT} desc={s.noD}
          action={<Link href="/assessment" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{s.start}</Link>} />
      </div>
    );
  }

  const name = (id: string | null) => DIMENSIONS.find((d) => d.id === id)?.[ta ? "titleTa" : "titleEn"] ?? "—";
  const archetype = ta ? `${ARCHETYPE_TA[result.archetype] ?? result.archetype} (${result.archetype})` : result.archetype;
  const experiments = experimentsFor(result);
  const prompts = promptsFor(result, lang);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PrintHeader titleEn="Assessment result" titleTa="மதிப்பீட்டு முடிவு" />
      <SectionHeading kicker={result.provisional ? s.prov : s.snap} title={ta ? `${archetype}` : `Welcome, ${archetype}`}
        desc={s.tempLabel} />
      {result.provisional && <div className="mx-auto mb-6 max-w-3xl"><Notice tone="warn">{ta ? `இந்த முடிவு தற்காலிகமானது — நிறைவு ${result.completionPct}%. “தெரியவில்லை” பதில்கள் பூஜ்ஜியமாகக் கணக்கிடப்படவில்லை, விலக்கப்பட்டன. பின்னர் முழுமையாக்குங்கள்.` : `This result is provisional — completion ${result.completionPct}%. “Not sure” answers were excluded, not scored as zero. Complete the assessment later for a fuller picture.`}</Notice></div>}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <h2 className="font-bold">{s.dims}</h2>
          <ul className="mt-3 space-y-3">
            {result.scores.map((s) => (
              <li key={s.id}>
                <div className="flex justify-between text-sm"><span>{name(s.id)}</span><strong>{s.percentage ?? "—"}% · {s.answered}/{s.total}</strong></div>
                <div className="mt-1 h-2 rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-imperial" style={{ width: `${s.percentage ?? 0}%` }} /></div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.overall}</dt><dd className="text-xl font-bold">{result.overall ?? "—"}%</dd></div>
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.balance}</dt><dd className="text-xl font-bold">{result.balance ?? "—"}%</dd></div>
            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.done}</dt><dd className="text-xl font-bold">{result.completionPct}%</dd></div>
          </dl>
          <p className="mt-3 break-words text-sm text-[var(--muted)]">{s.strongest} <strong className="text-[var(--fg)]">{name(result.strongest)}</strong> · {s.growth} <strong className="text-[var(--fg)]">{name(result.growth)}</strong></p>
        </Card>
        <Card className="min-w-0"><h2 className="font-bold">{s.map}</h2><div className="mt-2"><IkigaiWheel result={result} /></div></Card>
      </div>

      <div className="mt-4"><Card><h2 className="font-bold">{s.chart}</h2><div className="mt-2"><RadarChartView result={result} /></div></Card></div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <h2 className="font-bold">{s.exp}</h2>
          <ul className="mt-3 space-y-3">
            {experiments.map((e) => (
              <li key={e.titleEn} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold-contrast)]">{e.kind} · {e.minutes} min</p>
                <p className="font-semibold">{ta ? e.titleTa : e.titleEn}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{ta ? e.detailTa : e.detailEn}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--muted)]">{s.expNote}</p>
        </Card>
        <Card className="min-w-0">
          <h2 className="font-bold">{s.prompts}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{prompts.map((p) => <li key={p}>{p}</li>)}</ul>
          <h2 className="mt-5 font-bold">{s.limits}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{s.limitsD}</p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 no-print">
        <Link href="/plan" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{s.plan}</Link>
        <Link href="/flow" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">{s.flow}</Link>
        <Link href="/journal" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">{s.journal}</Link>
        <button className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={() => window.print()}>{s.print}</button>
        <button className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={() => downloadJSON("ikigai-result.json", result)}>{s.export}</button>
        <button className="rounded-full border border-error px-5 py-2.5 text-sm font-semibold text-error" onClick={() => { if (confirm(s.confirmReset)) { removeKey(STORAGE_KEYS.result); setResult(null); } }}>{s.reset}</button>
      </div>

      <div className="mt-6"><Card><h2 className="font-bold">{s.share}</h2><p className="mt-1 break-words text-sm">{ta ? `எனது தற்போதைய பார்வை: ${archetype} · ஒட்டுமொத்தம் ${result.overall}% · வலுவானது ${name(result.strongest)}.` : `My current reflection: ${result.archetype} · Overall ${result.overall}% · Strongest ${name(result.strongest)} · Exploring ${name(result.growth)} · Provisional: ${result.provisional ? "yes" : "no"}.`} ({s.shareNone})</p></Card></div>
    </div>
  );
}
