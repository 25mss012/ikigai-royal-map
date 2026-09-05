import type { Metadata } from "next";
import Link from "next/link";
import { LEARNING_THEMES } from "@/data/learning-themes";
import { SectionHeading } from "@/components/ui";
import { LangText } from "@/components/lang-text";

const WHO = [
  { en: "Students — try 20-minute curiosity tests before choosing subjects.", ta: "மாணவர்கள் — பாடம் தேரും முன் 20 நிமிட ஆர்வச் சோதனைகள்." },
  { en: "Job seekers — run one small reversible experiment each week.", ta: "வேலை தேடுவோர் — வாரம் ஒரு சிறு மீளக்கூடிய சோதனை." },
  { en: "Parents & caregivers — honour care itself as purpose; protect rest.", ta: "பெற்றோர் & பராமரிப்பாளர் — பராமரிப்பே நோக்கம்; ஓய்வைக் காக்கவும்." },
  { en: "Retired people — rebuild rhythm through one weekly social step.", ta: "ஓய்வு பெற்றோர் — வாரம் ஒரு சமூக அடியில் தாளம் மீட்க." },
  { en: "Artists & entrepreneurs — make small, share early, adjust cheaply.", ta: "கலைஞர் & தொழில்முனைவோர் — சிறிதாகச் செய்து, விரைவில் பகிர்ந்து, மலிவாகச் சரிசெய்க." },
  { en: "People with disabilities or limited income — every experiment here has a zero-cost version.", ta: "மாற்றுத்திறனாளிகள் / குறைந்த வருமானம் — ஒவ்வொரு சோதனைக்கும் செலவில்லாப் பதிப்பு உண்டு." },
  { en: "People facing uncertainty — shrink the horizon to one kind next step today.", ta: "நிச்சயமற்ற நிலையில் உள்ளோர் — இன்றைய ஒரு அன்பான அடிக்குச் சுருக்குங்கள்." },
];

export const metadata: Metadata = { title: "Learn Ikigai themes", description: "Twenty original essays on purpose, flow, community, rest, and small experiments.", alternates: { canonical: "/learn" } };

export default function LearnIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        kicker={<LangText en="Learn" ta="கற்க" />}
        title={<LangText en="Twenty small essays" ta="இருபது சிறு கட்டுரைகள்" />}
        desc={<LangText en="Original, practical reflections. Each takes about 3 minutes." ta="அசல், நடைமுறைச் சிந்தனைகள். ஒவ்வொன்றும் சுமார் 3 நிமிடம்." />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_THEMES.map((t, i) => (
          <Link key={t.slug} href={`/learn/${t.slug}`} className="royal-card group min-w-0 p-6 transition-transform hover:-translate-y-0.5">
            <p className="text-xs font-bold text-[var(--gold-contrast)]">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 break-words text-xl font-bold group-hover:underline"><LangText en={t.titleEn} ta={t.titleTa} /></h2>
            <p className="mt-1 break-words text-sm text-[var(--muted)]"><LangText en={t.insightEn} ta={t.insightTa} /></p>
          </Link>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="text-center text-xl font-bold"><LangText en="Who these essays help" ta="இந்தக் கட்டுரைகள் யாருக்கு" /></h2>
        <ul className="mt-4 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
          {WHO.map((w) => <li key={w.en} className="royal-card min-w-0 break-words p-4"><LangText en={w.en} ta={w.ta} /></li>)}
        </ul>
      </div>
    </div>
  );
}
