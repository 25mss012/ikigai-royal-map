import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARNING_THEMES } from "@/data/learning-themes";
import { EssayView } from "@/components/essay-view";

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
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <EssayView theme={theme} index={idx} prev={LEARNING_THEMES[idx - 1]} next={LEARNING_THEMES[idx + 1]} />
    </article>
  );
}
