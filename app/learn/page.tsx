import type { Metadata } from "next";
import Link from "next/link";
import { LEARNING_THEMES } from "@/data/learning-themes";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Learn Ikigai themes", description: "Twenty original essays on purpose, flow, community, rest, and small experiments.", alternates: { canonical: "/learn" } };

export default function LearnIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading kicker="Learn" title="Twenty small essays" desc="Original, practical reflections. Each takes about 3 minutes." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_THEMES.map((t, i) => (
          <Link key={t.slug} href={`/learn/${t.slug}`} className="royal-card group p-6 hover:-translate-y-0.5 transition-transform">
            <p className="text-xs font-bold text-[var(--gold-contrast)]">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 text-xl font-bold group-hover:underline">{t.titleEn}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.insightEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
