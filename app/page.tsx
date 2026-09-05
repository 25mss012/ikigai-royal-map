import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Flower2, HeartHandshake, NotebookPen, Map as MapIcon, Sparkles, Users } from "lucide-react";
import { Card, SectionHeading, Notice } from "@/components/ui";
import { LangText } from "@/components/lang-text";
import { DIMENSIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ikigai — Discover Purpose, Meaning, and Direction",
  description: "A private and practical Ikigai journey with reflection tools, an interactive purpose map, flow tracking, a 30-day plan, and a personal journal.",
  alternates: { canonical: "/" },
};

const FOUR = [
  { titleEn: "What you love", titleTa: "நீங்கள் விரும்புவது", descEn: "Activities and subjects that give energy — not a test, a lens.", descTa: "ஆற்றல் தரும் செயல்கள், தலைப்புகள் — தேர்வு அல்ல, பார்வை.", icon: Sparkles },
  { titleEn: "What you are good at", titleTa: "உங்கள் திறன்", descEn: "Skills grown through practice, noticed by you and others.", descTa: "பயிற்சியால் வளர்ந்த திறன்கள் — நீங்களும் மற்றவரும் காண்பது.", icon: Compass },
  { titleEn: "What the world needs", titleTa: "உலகத் தேவை", descEn: "People, places, and problems you genuinely care about.", descTa: "நீங்கள் உண்மையில் அக்கறை கொள்ளும் மனிதர், இடம், பிரச்சினைகள்.", icon: HeartHandshake },
  { titleEn: "What creates value", titleTa: "மதிப்பு உருவாக்கம்", descEn: "Ways your care can be shared sustainably — paid or unpaid.", descTa: "உங்கள் அக்கறையை நிலையாகப் பகிரும் வழிகள் — ஊதியத்துடனோ இல்லாமலோ.", icon: Flower2 },
];

const STEPS = [
  { en: "Reflect", ta: "சிந்தியுங்கள்" }, { en: "Discover patterns", ta: "வடிவங்களைக் காணுங்கள்" },
  { en: "Try small experiments", ta: "சிறு சோதனைகள்" }, { en: "Learn from experience", ta: "அனுபவத்திலிருந்து கற்க" },
  { en: "Recalibrate", ta: "மீண்டும் சரிசெய்க" },
];

const AUDIENCES = [
  { en: "Students", ta: "மாணவர்கள்" }, { en: "Workers", ta: "பணியாளர்கள்" },
  { en: "Creators", ta: "படைப்பாளர்கள்" }, { en: "Caregivers", ta: "பராமரிப்பாளர்கள்" },
  { en: "Explorers", ta: "ஆராய்வோர்" }, { en: "Older adults", ta: "மூத்தோர்" },
];

const FEATURES = [
  { href: "/assessment", icon: MapIcon, titleEn: "Assessment", titleTa: "மதிப்பீடு", descEn: "40 gentle questions across 5 dimensions. Pause anytime.", descTa: "5 பரிமாணங்களில் 40 மென்மையான கேள்விகள். எப்போதும் நிறுத்தலாம்." },
  { href: "/assessment/results", icon: Compass, titleEn: "Ikigai map", titleTa: "இகிகை வரைபடம்", descEn: "Radar + circular map with honest, provisional scores.", descTa: "நேர்மையான, தற்காலிக மதிப்பெண்களுடன் வரைபடம்." },
  { href: "/flow", icon: Sparkles, titleEn: "Flow Lab", titleTa: "ஓட்ட ஆய்வகம்", descEn: "Track focus, joy, and challenge fit.", descTa: "கவனம், மகிழ்ச்சி, சவால் பொருத்தத்தைப் பதிக." },
  { href: "/plan", icon: BookOpen, titleEn: "30-day plan", titleTa: "30-நாள் திட்டம்", descEn: "One small step a day. Skip without shame.", descTa: "நாளுக்கு ஒரு சிறு அடி. குற்றவுணர்வின்றித் தவிர்க்கலாம்." },
  { href: "/journal", icon: NotebookPen, titleEn: "Journal", titleTa: "நாட்குறிப்பு", descEn: "Private reflections stored only in your browser.", descTa: "உங்கள் உலாவியில் மட்டும் சேமிக்கப்படும் தனிப்பட்ட குறிப்புகள்." },
  { href: "/circle", icon: Users, titleEn: "Support circle", titleTa: "துணை வட்டம்", descEn: "Five steady connections that hold your purpose.", descTa: "நோக்கத்தைத் தாங்கும் ஐந்து நிலையான தொடர்புகள்." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="sunrise-bg pattern-seigaiha border-b border-[var(--border)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="min-w-0">
            <p className="mb-3 inline-block rounded-full border border-imperial/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-contrast)]"><LangText en="Private · Practical · No sign-up" ta="தனிப்பட்டது · நடைமுறை · பதிவு தேவையில்லை" /></p>
            <h1 className="break-words text-4xl font-bold sm:text-5xl lg:text-6xl"><LangText en="Your purpose is not a destination. It is a direction." ta="உங்கள் நோக்கம் சேருமிடம் அல்ல. அது ஒரு திசை." /></h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--muted)]"><LangText en="A private, practical journey to understand what gives you energy, meaning, connection, and momentum." ta="உங்களுக்கு ஆற்றல், பொருள், தொடர்பு, உந்துதல் தருவதைப் புரிந்துகொள்ள தனிப்பட்ட, நடைமுறைப் பயணம்." /></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assessment" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-midnight px-6 py-3 font-semibold text-champagne dark:bg-imperial dark:text-obsidian"><LangText en="Begin Your Journey" ta="பயணத்தைத் தொடங்குங்கள்" /> <ArrowRight size={18} /></Link>
              <Link href="/learn" className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--border)] px-6 py-3 font-semibold"><LangText en="Explore Ikigai" ta="இகிகையை அறியுங்கள்" /></Link>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]"><LangText en="5 minutes is enough to begin. Your data never leaves this browser." ta="தொடங்க 5 நிமிடம் போதும். உங்கள் தரவு இந்த உலாவியை விட்டு வெளியேறாது." /></p>
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
              <p className="mt-4 text-center text-sm text-[var(--muted)]"><LangText en="Four lenses + your lived rhythm — a map, not a verdict." ta="நான்கு பார்வைகள் + உங்கள் வாழ்க்கைத் தாளம் — வரைபடம், தீர்ப்பு அல்ல." /></p>
            </div>
          </div>
        </div>
      </section>

      {/* Four areas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker={<LangText en="The four lenses" ta="நான்கு பார்வைகள்" />} title={<LangText en="Four gentle questions" ta="நான்கு மென்மையான கேள்விகள்" />} desc={<LangText en="These are reflection dimensions — not a strict definition of anyone's Ikigai." ta="இவை சிந்தனைப் பரிமாணங்கள் — யாருடைய இகிகைக்கும் இறுக்கமான வரையறை அல்ல." />} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOUR.map((f) => (
            <Card key={f.titleEn} className="min-w-0">
              <f.icon className="mb-3 text-[var(--gold-contrast)]" size={26} aria-hidden="true" />
              <h3 className="break-words text-xl font-bold"><LangText en={f.titleEn} ta={f.titleTa} /></h3>
              <p className="mt-2 break-words text-sm text-[var(--muted)]"><LangText en={f.descEn} ta={f.descTa} /></p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-3xl"><Notice><LangText en="Scores are indicators, not diagnoses. Reflection matters more than any number." ta="மதிப்பெண்கள் குறிகாட்டிகள், நோயறிதல் அல்ல. எண்ணைவிடச் சிந்தனையே முக்கியம்." /></Notice></div>
      </section>

      {/* How it works */}
      <section className="border-y border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading kicker={<LangText en="How it works" ta="எப்படிச் செயல்படும்" />} title={<LangText en="A calm loop, not a race" ta="அமைதியான சுழற்சி, போட்டி அல்ல" />} />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.en} className="royal-card min-w-0 p-5 text-center">
                <p className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-midnight font-bold text-champagne dark:bg-imperial dark:text-obsidian" aria-hidden="true">{i + 1}</p>
                <p className="break-words font-semibold"><LangText en={s.en} ta={s.ta} /></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker={<LangText en="For every life" ta="ஒவ்வொரு வாழ்க்கைக்கும்" />} title={<LangText en="Who is this for?" ta="யாருக்கானது?" />} desc={<LangText en="Purpose is personal. There is no single fixed destiny here." ta="நோக்கம் தனிப்பட்டது. இங்கு ஒரே நிலையான விதி இல்லை." />} />
        <ul className="flex flex-wrap justify-center gap-2">
          {AUDIENCES.map((a) => <li key={a.en} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"><LangText en={a.en} ta={a.ta} /></li>)}
        </ul>
        <div className="mt-6 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
          <p><strong className="text-[var(--fg)]"><LangText en="Students" ta="மாணவர்கள்" /></strong> — <LangText en="explore subjects with 20-minute tests." ta="20 நிமிடச் சோதனைகளில் பாடங்களை ஆராயுங்கள்." /></p>
          <p><strong className="text-[var(--fg)]"><LangText en="Caregivers & parents" ta="பராமரிப்பாளர் & பெற்றோர்" /></strong> — <LangText en="honour care as purpose; protect rest." ta="பராமரிப்பை நோக்கமாக மதியுங்கள்; ஓய்வைக் காக்கவும்." /></p>
          <p><strong className="text-[var(--fg)]"><LangText en="Retired & transitioning" ta="ஓய்வு & மாற்றம்" /></strong> — <LangText en="rebuild rhythm through small social steps." ta="சிறு சமூக அடிகளில் தாளத்தை மீட்கவும்." /></p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading kicker={<LangText en="Tools" ta="கருவிகள்" />} title={<LangText en="Everything works without an account" ta="கணக்கின்றி அனைத்தும் செயல்படும்" />} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="royal-card group min-w-0 p-6 transition-transform hover:-translate-y-0.5">
              <f.icon className="mb-3 text-jade dark:text-imperial-light" size={26} aria-hidden="true" />
              <h3 className="break-words text-xl font-bold group-hover:underline"><LangText en={f.titleEn} ta={f.titleTa} /></h3>
              <p className="mt-1 break-words text-sm text-[var(--muted)]"><LangText en={f.descEn} ta={f.descTa} /></p>
            </Link>
          ))}
        </div>
      </section>

      {/* Responsible */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <Card className="border-imperial/40 text-center">
          <h2 className="break-words text-2xl font-bold"><LangText en="No perfect score. No fixed destiny. No judgment." ta="சரியான மதிப்பெண் இல்லை. நிலையான விதி இல்லை. தீர்ப்பு இல்லை." /></h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]"><LangText en="This is an educational reflection tool — not medical, career, financial, or religious advice. Small experiments beat endless self-analysis. Rest is not failure." ta="இது கல்விச் சிந்தனைக் கருவி — மருத்துவ, தொழில், நிதி, சமய ஆலோசனை அல்ல. முடிவற்ற சுய ஆய்வைவிடச் சிறு சோதனைகள் சிறந்தது. ஓய்வு தோல்வி அல்ல." /></p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/responsible-use" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"><LangText en="Responsible use" ta="பொறுப்பான பயன்" /></Link>
            <Link href="/dashboard" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian"><LangText en="Open dashboard" ta="பலகையைத் திற" /></Link>
          </div>
        </Card>
        <div className="mt-6 text-center text-xs text-[var(--muted)]">
          <p><LangText en={<>Dimensions: {DIMENSIONS.map((d) => d.titleEn).join(" · ")}</>} ta={<>பரிமாணங்கள்: {DIMENSIONS.map((d) => d.titleTa).join(" · ")}</>} /></p>
        </div>
      </section>
    </div>
  );
}
