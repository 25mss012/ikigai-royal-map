import type { Metadata } from "next";
import Link from "next/link";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "About this companion", description: "Why this independent educational companion exists and how to use it kindly.", alternates: { canonical: "/about" } };

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="About" title="A calm companion, not an authority" desc="Independent, private, and practical." />
      <div className="grid gap-4">
        <Card><h2 className="text-xl font-bold">What this is</h2><p className="mt-2 text-sm leading-relaxed">An educational reflection tool inspired by general themes associated with Ikigai — purpose, flow, community, moderation, movement, mindfulness, resilience. All explanations and examples are original.</p></Card>
        <Card><h2 className="text-xl font-bold">What this is not</h2><p className="mt-2 text-sm leading-relaxed">Not medical, psychological, career, financial, or religious advice. Not affiliated with any book, author, or publisher. Scores are provisional reflection indicators — never diagnoses or destinies.</p></Card>
        <Card><h2 className="text-xl font-bold">How to use it well</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><li>Begin with 5 minutes — one essay or three questions.</li><li>Run small reversible experiments instead of over-analysing.</li><li>Rest counts. Skipping without shame is built in.</li><li>Export your data; delete it anytime.</li></ul></Card>
        <div className="flex flex-wrap gap-3">
          <Link href="/assessment" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Start assessment</Link>
          <Link href="/responsible-use" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">Responsible use</Link>
        </div>
      </div>
    </div>
  );
}
