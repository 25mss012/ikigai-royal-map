"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS } from "@/data/assessment-questions";
import { STORAGE_KEYS, DIMENSIONS } from "@/lib/constants";
import { getJSON, setJSON } from "@/lib/storage";
import { scoreAll } from "@/lib/scoring";
import { usePrefs } from "@/components/providers";
import { Button, Card, Notice, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AnswerValue } from "@/types";

type Step = { kind: "intro" } | { kind: "q"; index: number } | { kind: "review" };

export default function AssessmentPage() {
  const { prefs } = usePrefs();
  const lang = prefs.lang;
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = getJSON<Record<string, AnswerValue>>(STORAGE_KEYS.answers, {});
    setAnswers(saved);
    // resume at first unanswered if progress exists
    const idx = ASSESSMENT_QUESTIONS.findIndex((q) => saved[q.id] === undefined);
    if (Object.keys(saved).length > 0 && idx !== -1) setStep({ kind: "q", index: idx });
    else if (Object.keys(saved).length > 0 && idx === -1) setStep({ kind: "review" });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) setJSON(STORAGE_KEYS.answers, answers);
  }, [answers, loaded]);

  const answeredCount = useMemo(() => ASSESSMENT_QUESTIONS.filter((q) => answers[q.id] !== undefined).length, [answers]);
  const pct = Math.round((answeredCount / ASSESSMENT_QUESTIONS.length) * 100);

  const choose = (qid: string, v: AnswerValue) => {
    setAnswers((a) => ({ ...a, [qid]: v }));
  };

  const submit = () => {
    const result = scoreAll(answers);
    setJSON(STORAGE_KEYS.result, result);
    router.push("/assessment/results");
  };

  if (!loaded) return <div className="mx-auto max-w-3xl px-4 py-12"><p>Loading…</p></div>;

  if (step.kind === "intro") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">Assessment · 40 questions · ~10 min</p>
        <h1 className="mt-2 text-4xl font-bold">{lang === "ta" ? "உங்கள் வடிவங்களைக் கண்டறியுங்கள்" : "Discover your patterns"}</h1>
        <p className="mt-3 text-[var(--muted)]">Five dimensions · eight questions each. Scale 1–5 plus “I am not sure”. Progress saves after every answer. You can pause, go back, and review before submitting.</p>
        <div className="mt-6 grid gap-3">
          {DIMENSIONS.map((d) => (
            <Card key={d.id} className="flex items-center gap-4">
              <span className="size-3 rounded-full" style={{ background: d.color }} aria-hidden="true" />
              <div><p className="font-semibold">{lang === "ta" ? d.titleTa : d.titleEn}</p><p className="text-sm text-[var(--muted)]">{lang === "ta" ? d.descTa : d.descEn}</p></div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setStep({ kind: "q", index: 0 })}>{answeredCount > 0 ? `Continue (${answeredCount}/40)` : "Start"}</Button>
          {answeredCount > 0 && <Button variant="secondary" onClick={() => { setAnswers({}); setStep({ kind: "q", index: 0 }); }}>Restart</Button>}
        </div>
        <div className="mt-6"><Notice>“I am not sure” is not scored as zero — it marks the question incomplete and your result provisional.</Notice></div>
      </div>
    );
  }

  if (step.kind === "review") {
    const missing = ASSESSMENT_QUESTIONS.filter((q) => answers[q.id] === undefined);
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Review before submitting</h1>
        <div className="mt-4"><ProgressBar value={pct} label={`${answeredCount} of 40 answered · ${pct}%`} /></div>
        {missing.length > 0 && <div className="mt-4"><Notice tone="warn">This result will be provisional — {missing.length} question(s) unanswered or “not sure”. You can submit now or go back.</Notice></div>}
        <ul className="mt-6 grid gap-2">
          {ASSESSMENT_QUESTIONS.map((q, i) => {
            const v = answers[q.id];
            return (
              <li key={q.id}>
                <button onClick={() => setStep({ kind: "q", index: i })} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] px-4 py-2.5 text-left text-sm hover:border-imperial", v === undefined && "border-warning/60")}>
                  <span><strong>Q{i + 1}.</strong> {(lang === "ta" ? q.ta : q.en).slice(0, 80)}…</span>
                  <span className="shrink-0 font-bold">{v === undefined || v === null ? "—" : `${v}/5`}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setStep({ kind: "q", index: 0 })}>Back to questions</Button>
          <Button onClick={submit}>See my result</Button>
        </div>
      </div>
    );
  }

  const i = step.index;
  const q = ASSESSMENT_QUESTIONS[i];
  const dimIdx = DIMENSIONS.findIndex((d) => d.id === q.dimension);
  const options: { v: AnswerValue; label: string }[] = [
    { v: 1, label: lang === "ta" ? "1 · பொருந்தாது" : "1 · Not true for me" },
    { v: 2, label: lang === "ta" ? "2 · சிறிது" : "2 · Slightly true" },
    { v: 3, label: lang === "ta" ? "3 · சில நேரம்" : "3 · Sometimes true" },
    { v: 4, label: lang === "ta" ? "4 · பெரும்பாலும்" : "4 · Mostly true" },
    { v: 5, label: lang === "ta" ? "5 · மிகவும்" : "5 · Very true for me" },
    { v: null, label: lang === "ta" ? "தெரியவில்லை" : "I am not sure" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span>Question {i + 1} of 40 · {DIMENSIONS[dimIdx][lang === "ta" ? "titleTa" : "titleEn"]}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2"><ProgressBar value={((i + 1) / 40) * 100} label={`Progress ${i + 1}/40`} /></div>
      <Card className="mt-6">
        <h1 className="text-2xl font-bold">{lang === "ta" ? q.ta : q.en}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{lang === "ta" ? q.exampleTa : q.exampleEn}</p>
        <div className="mt-6 grid gap-2" role="radiogroup" aria-label={`Question ${i + 1}`}>
          {options.map((o) => {
            const selected = answers[q.id] === o.v || (o.v === null && answers[q.id] === null);
            return (
              <button key={o.label} role="radio" aria-checked={selected}
                onClick={() => choose(q.id, o.v)}
                className={cn("rounded-2xl border px-4 py-3 text-left font-medium transition-colors",
                  selected ? "border-imperial bg-imperial/15" : "border-[var(--border)] hover:border-imperial")}>
                {o.label}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="secondary" disabled={i === 0} onClick={() => setStep({ kind: "q", index: i - 1 })}>Back</Button>
          {i < 39
            ? <Button onClick={() => setStep({ kind: "q", index: i + 1 })}>Next</Button>
            : <Button onClick={() => setStep({ kind: "review" })}>Review</Button>}
        </div>
      </Card>
      <div className="mt-4 flex justify-between text-sm">
        <button className="underline" onClick={() => setStep({ kind: "review" })}>Jump to review ({answeredCount}/40)</button>
        <button className="underline" onClick={() => { setAnswers({}); setStep({ kind: "q", index: 0 }); }}>Clear progress</button>
      </div>
    </div>
  );
}
