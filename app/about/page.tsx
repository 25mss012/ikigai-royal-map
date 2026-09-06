import type { Metadata } from "next";
import Link from "next/link";
import { Card, SectionHeading } from "@/components/ui";
import { LangText } from "@/components/lang-text";

export const metadata: Metadata = { title: "About this companion", description: "Why this independent educational companion exists and how to use it kindly.", alternates: { canonical: "/about" } };

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker={<LangText en="About" ta="பற்றி" />} title={<LangText en="A calm companion, not an authority" ta="அமைதியான துணை, அதிகாரம் அல்ல" />} desc={<LangText en="Independent, private, and practical." ta="சுயாதீனமானது, தனிப்பட்டது, நடைமுறையானது." />} />
      <div className="grid gap-4">
        <Card><h2 className="text-xl font-bold"><LangText en="What this is" ta="இது என்ன" /></h2><p className="mt-2 text-sm leading-relaxed"><LangText en="An educational reflection tool inspired by general themes associated with Ikigai — purpose, flow, community, moderation, movement, mindfulness, resilience. All explanations and examples are original." ta="இகிகையுடன் தொடர்புடைய பொதுக் கருத்துகளால் — நோக்கம், ஒன்றிப்பு, சமூகம், அளவு, அசைவு, கவனம், மீள்திறன் — ஈர்க்கப்பட்ட கல்விச் சிந்தனைக் கருவி. அனைத்து விளக்கங்களும் எடுத்துக்காட்டுகளும் அசலானவை." /></p></Card>
        <Card><h2 className="text-xl font-bold"><LangText en="What this is not" ta="இது எது அல்ல" /></h2><p className="mt-2 text-sm leading-relaxed"><LangText en="Not medical, psychological, career, financial, or religious advice. Not affiliated with any book, author, or publisher. Scores are provisional reflection indicators — never diagnoses or destinies." ta="மருத்துவ, உளவியல், தொழில், நிதி, சமய ஆலோசனை அல்ல. எந்தப் புத்தகம், ஆசிரியர், பதிப்பாளருடனும் தொடர்பில்லை. மதிப்பெண்கள் தற்காலிகச் சிந்தனைக் குறிகாட்டிகள் — நோயறிதலோ விதியோ அல்ல." /></p></Card>
        <Card className="border-imperial/60"><h2 className="text-xl font-bold"><LangText en="Why this project exists" ta="இந்தத் திட்டம் ஏன் உள்ளது" /></h2>
          <p className="mt-2 text-sm leading-relaxed"><LangText en="I did not want to build another website that simply explains Ikigai. I wanted to turn the ideas into something a person could actually interact with." ta="இகிகையை விளக்கும் மற்றொரு இணையதளத்தை உருவாக்க நான் விரும்பவில்லை. கருத்துகளை ஒருவர் உண்மையில் கையாளக்கூடிய ஒன்றாக மாற்ற விரும்பினேன்." /></p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm"><LangText en={<><li>A book concept becomes a reflection prompt.</li><li>Your response becomes an assessment answer.</li><li>Answers become a personal insight map.</li><li>Insights become journal reflections.</li><li>Reflections become a 30-day personal plan.</li></>} ta={<><li>புத்தகக் கருத்து சிந்தனைக் கேள்வியாகிறது.</li><li>உங்கள் பதில் மதிப்பீட்டு விடையாகிறது.</li><li>விடைகள் தனிப்பட்ட நுண்ணறிவு வரைபடமாகின்றன.</li><li>நுண்ணறிவுகள் நாட்குறிப்புச் சிந்தனைகளாகின்றன.</li><li>சிந்தனைகள் 30-நாள் தனிப்பட்ட திட்டமாகின்றன.</li></>} /></ol>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]"><LangText en="Conceptually inspired by Ikigai: The Japanese Secret to a Long and Happy Life by Héctor García and Francesc Miralles — an independent, unofficial interpretation. Not created or endorsed by the authors or publisher." ta="Héctor García, Francesc Miralles எழுதிய Ikigai: The Japanese Secret to a Long and Happy Life என்ற நூலின் கருத்துகளால் ஈர்க்கப்பட்டது — சுயாதீனமான, அதிகாரப்பூர்வமற்ற விளக்கம். ஆசிரியர்களோ பதிப்பாளரோ உருவாக்கவோ ஆதரிக்கவோ இல்லை." /></p>
        </Card>
        <Card><h2 className="text-xl font-bold"><LangText en="How to use it well" ta="நன்கு பயன்படுத்துவது எப்படி" /></h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><LangText en={<><li>Begin with 5 minutes — one essay or three questions.</li><li>Run small reversible experiments instead of over-analysing.</li><li>Rest counts. Skipping without shame is built in.</li><li>Export your data; delete it anytime.</li></>} ta={<><li>5 நிமிடத்தில் தொடங்குங்கள் — ஒரு கட்டுரை அல்லது மூன்று கேள்விகள்.</li><li>அதிக ஆய்வுக்குப் பதில் சிறு மீளக்கூடிய சோதனைகள்.</li><li>ஓய்வும் கணக்கு. குற்றவுணர்வின்றித் தவிர்க்கலாம்.</li><li>தரவை ஏற்றுமதி செய்க; எப்போதும் நீக்கலாம்.</li></>} /></ul></Card>
        <div className="flex flex-wrap gap-3">
          <Link href="/assessment" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian"><LangText en="Start assessment" ta="மதிப்பீட்டைத் தொடங்கு" /></Link>
          <Link href="/responsible-use" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"><LangText en="Responsible use" ta="பொறுப்பான பயன்" /></Link>
        </div>
      </div>
    </div>
  );
}
