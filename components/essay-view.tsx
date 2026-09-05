"use client";
import Link from "next/link";
import type { LearningTheme } from "@/data/learning-themes";
import { usePrefs } from "@/components/providers";
import { Card, Notice } from "@/components/ui";
import { MEDICAL_NOTICE_EN, MEDICAL_NOTICE_TA } from "@/lib/constants";

/** Bilingual essay body. Picks Tamil fields when Tamil is selected. */
export function EssayView({ theme, index, prev, next }: {
  theme: LearningTheme;
  index: number;
  prev?: LearningTheme;
  next?: LearningTheme;
}) {
  const { prefs } = usePrefs();
  const ta = prefs.lang === "ta";
  const body = ta ? theme.bodyTa : theme.bodyEn;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">
        {ta ? `கட்டுரை ${index + 1} / 20` : `Essay ${index + 1} of 20`}
      </p>
      <h1 className="mt-2 text-4xl font-bold">{ta ? theme.titleTa : theme.titleEn}</h1>
      <div className="royal-divider my-6" aria-hidden="true" />
      {body.map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>)}
      <Card className="my-6 border-imperial/40">
        <h2 className="font-bold">{ta ? "முக்கிய நுண்ணறிவு" : "Key insight"}</h2>
        <p className="mt-1">{ta ? theme.insightTa : theme.insightEn}</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><h2 className="font-bold">{ta ? "இன்று இதை முயலுங்கள்" : "Try this today"}</h2><p className="mt-1 text-sm">{ta ? theme.tryTa : theme.tryEn}</p></Card>
        <Card><h2 className="font-bold">{ta ? "சிந்தியுங்கள்" : "Reflect"}</h2><p className="mt-1 text-sm">{ta ? theme.reflectTa : theme.reflectEn}</p></Card>
      </div>
      {(ta ? theme.cautionTa : theme.cautionEn) && (
        <div className="mt-4"><Notice tone="warn">{ta ? theme.cautionTa : theme.cautionEn} {ta ? MEDICAL_NOTICE_TA : MEDICAL_NOTICE_EN}</Notice></div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={theme.feature} className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{theme.featureLabel}</Link>
        <Link href="/learn" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">{ta ? "அனைத்து கட்டுரைகள்" : "All essays"}</Link>
      </div>
      <nav className="mt-10 flex justify-between gap-3 text-sm" aria-label={ta ? "மேலும் கட்டுரைகள்" : "More essays"}>
        {prev ? <Link href={`/learn/${prev.slug}`} className="underline">← {ta ? prev.titleTa : prev.titleEn}</Link> : <span />}
        {next ? <Link href={`/learn/${next.slug}`} className="underline">{ta ? next.titleTa : next.titleEn} →</Link> : <span />}
      </nav>
    </div>
  );
}
