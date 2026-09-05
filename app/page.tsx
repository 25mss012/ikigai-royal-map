import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Flower2, HeartHandshake, NotebookPen, Map as MapIcon, Sparkles, Users } from "lucide-react";
import { Card, SectionHeading, Notice } from "@/components/ui";
import { DIMENSIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ikigai — Discover Purpose, Meaning, and Direction",
  description: "A private and practical Ikigai journey with reflection tools, an interactive purpose map, flow tracking, a 30-day plan, and a personal journal.",
  alternates: { canonical: "/" },
};

const FOUR = [
  { title: "What you love", desc: "Activities and subjects that give energy — not a test, a lens.", icon: Sparkles },
  { title: "What you are good at", desc: "Skills grown through practice, noticed by you and others.", icon: Compass },
  { title: "What the world needs", desc: "People, places, and problems you genuinely care about.", icon: HeartHandshake },
  { title: "What creates value", desc: "Ways your care can be shared sustainably — paid or unpaid.", icon: Flower2 },
];

const STEPS = ["Reflect", "Discover patterns", "Try small experiments", "Learn from experience", "Recalibrate"];

const AUDIENCES = ["Students", "Workers", "Creators", "Caregivers", "Explorers", "Older adults"];

const FEATURES = [
  { href: "/assessment", icon: MapIcon, title: "Assessment", desc: "40 gentle questions across 5 dimensions. Pause anytime." },
  { href: "/assessment/results", icon: Compass, title: "Ikigai map", desc: "Radar + circular map with honest, provisional scores." },
  { href: "/flow", icon: Sparkles, title: "Flow Lab", desc: "Track focus, joy, and challenge fit." },
  { href: "/plan", icon: BookOpen, title: "30-day plan", desc: "One small step a day. Skip without shame." },
  { href: "/journal", icon: NotebookPen, title: "Journal", desc: "Private reflections stored only in your browser." },
  { href: "/circle", icon: Users, title: "Support circle", desc: "Five steady connections that hold your purpose." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="sunrise-bg pattern-seigaiha border-b border-[var(--border)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 inline-block rounded-full border border-imperial/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-contrast)]">Private · Practical · No sign-up</p>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Your purpose is not a destination. It is a direction.</h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">A private, practical journey to understand what gives you energy, meaning, connection, and momentum.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assessment" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-midnight px-6 py-3 font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Begin Your Journey <ArrowRight size={18} /></Link>
              <Link href="/learn" className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--border)] px-6 py-3 font-semibold">Explore Ikigai</Link>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">5 minutes is enough to begin. Your data never leaves this browser.</p>
          </div>
          <div aria-hidden="true">
            <div className="royal-card relative overflow-hidden p-8">
              <svg viewBox="0 0 400 260" className="w-full" role="presentation">
                <defs>
                  <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E4C65B" /><stop offset="1" stopColor="#C9A227" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="150" r="70" fill="url(#sun)" />
                <rect x="40" y="150" width="320" height="3" fill="#C9A227" opacity="0.6" />
                <g stroke="#174A45" strokeWidth="2" opacity="0.5" fill="none">
                  <path d="M40 190 Q80 175 120 190 T200 190 T280 190 T360 190" />
                  <path d="M40 210 Q80 195 120 210 T200 210 T280 210 T360 210" />
                </g>
                <g fontSize="13" fill="currentColor" opacity="0.85">
                  <text x="60" y="60">love</text><text x="300" y="60">skill</text>
                  <text x="40" y="130">care</text><text x="310" y="130">value</text>
                  <text x="180" y="245">flow</text>
                </g>
              </svg>
              <p className="mt-4 text-center text-sm text-[var(--muted)]">Four lenses + your lived rhythm — a map, not a verdict.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four areas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker="The four lenses" title="Four gentle questions" desc="These are reflection dimensions — not a strict definition of anyone's Ikigai." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOUR.map((f) => (
            <Card key={f.title}>
              <f.icon className="mb-3 text-[var(--gold-contrast)]" size={26} aria-hidden="true" />
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{f.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-3xl"><Notice>Scores are indicators, not diagnoses. Reflection matters more than any number.</Notice></div>
      </section>

      {/* How it works */}
      <section className="border-y border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading kicker="How it works" title="A calm loop, not a race" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s} className="royal-card p-5 text-center">
                <p className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-midnight font-bold text-champagne dark:bg-imperial dark:text-obsidian" aria-hidden="true">{i + 1}</p>
                <p className="font-semibold">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker="For every life" title="Who is this for?" desc="Purpose is personal. There is no single fixed destiny here." />
        <ul className="flex flex-wrap justify-center gap-2">
          {AUDIENCES.map((a) => <li key={a} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">{a}</li>)}
        </ul>
        <div className="mt-6 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
          <p><strong className="text-[var(--fg)]">Students</strong> — explore subjects with 20-minute tests.</p>
          <p><strong className="text-[var(--fg)]">Caregivers & parents</strong> — honour care as purpose; protect rest.</p>
          <p><strong className="text-[var(--fg)]">Retired & transitioning</strong> — rebuild rhythm through small social steps.</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading kicker="Tools" title="Everything works without an account" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="royal-card group p-6 transition-transform hover:-translate-y-0.5">
              <f.icon className="mb-3 text-jade dark:text-imperial-light" size={26} aria-hidden="true" />
              <h3 className="text-xl font-bold group-hover:underline">{f.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Responsible */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <Card className="border-imperial/40 text-center">
          <h2 className="text-2xl font-bold">No perfect score. No fixed destiny. No judgment.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">This is an educational reflection tool — not medical, career, financial, or religious advice. Small experiments beat endless self-analysis. Rest is not failure.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/responsible-use" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">Responsible use</Link>
            <Link href="/dashboard" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Open dashboard</Link>
          </div>
        </Card>
        <div className="mt-6 text-center text-xs text-[var(--muted)]">
          <p>Dimensions: {DIMENSIONS.map((d) => d.titleEn).join(" · ")}</p>
        </div>
      </section>
    </div>
  );
}
