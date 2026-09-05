import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEARNING_THEMES } from "@/data/learning-themes";
import { Card, Notice } from "@/components/ui";
import { MEDICAL_NOTICE_EN } from "@/lib/constants";

export function generateStaticParams() {
  return LEARNING_THEMES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = LEARNING_THEMES.find((x) => x.slug === params.slug);
  if (!t) return { title: "Not found" };
  return { title: t.titleEn, description: t.insightEn, alternates: { canonical: `/learn/${t.slug}` } };
}

export default function LearnSlug({ params }: { params: { slug: string } }) {
  const theme = LEARNING_THEMES.find((x) => x.slug === params.slug);
  if (!theme) notFound();
  const idx = LEARNING_THEMES.indexOf(theme);
  const prev = LEARNING_THEMES[idx - 1];
  const next = LEARNING_THEMES[idx + 1];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">Essay {idx + 1} of 20</p>
      <h1 className="mt-2 text-4xl font-bold">{theme.titleEn}</h1>
      <div className="royal-divider my-6" aria-hidden="true" />
      {theme.bodyEn.map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>)}
      <Card className="my-6 border-imperial/40">
        <h2 className="font-bold">Key insight</h2>
        <p className="mt-1">{theme.insightEn}</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><h2 className="font-bold">Try this today</h2><p className="mt-1 text-sm">{theme.tryEn}</p></Card>
        <Card><h2 className="font-bold">Reflect</h2><p className="mt-1 text-sm">{theme.reflectEn}</p></Card>
      </div>
      {theme.cautionEn && <div className="mt-4"><Notice tone="warn">{theme.cautionEn} {MEDICAL_NOTICE_EN}</Notice></div>}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={theme.feature} className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{theme.featureLabel}</Link>
        <Link href="/learn" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">All essays</Link>
      </div>
      <nav className="mt-10 flex justify-between gap-3 text-sm" aria-label="More essays">
        {prev ? <Link href={`/learn/${prev.slug}`} className="underline">← {prev.titleEn}</Link> : <span />}
        {next ? <Link href={`/learn/${next.slug}`} className="underline">{next.titleEn} →</Link> : <span />}
      </nav>
    </article>
  );
}
