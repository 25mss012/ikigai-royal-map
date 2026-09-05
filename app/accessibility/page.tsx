"use client";
import { usePrefs } from "@/components/providers";
import { Card, SectionHeading } from "@/components/ui";

const STR = {
  en: {
    kicker: "Accessibility", title: "Comfortable for everyone", desc: "Keyboard, screen reader, touch, and motion friendly.",
    settings: "Display settings (saved in this browser)", motion: "Reduce motion", contrast: "High contrast",
    textSize: "Text size", normal: "Normal", large: "Large", xl: "Extra large",
    theme: "Theme", light: "Light", dark: "Dark", language: "Language",
    practices: "Built-in practices",
    items: [
      "Skip-to-content link, semantic landmarks, heading hierarchy.",
      "Visible focus rings; full keyboard operation; 44px targets.",
      "Form labels, error announcements, no colour-only meaning.",
      "Charts always paired with text tables; decorative images hidden from assistive tech.",
      "No autoplay, flashing, or timed interactions.",
      "Zoom to 200%-safe responsive layout.",
    ],
  },
  ta: {
    kicker: "அணுகல்", title: "அனைவருக்கும் வசதி", desc: "விசைப்பலகை, திரை வாசகர், தொடுதல், அசைவு நட்பு.",
    settings: "காட்சி அமைப்புகள் (இந்த உலாவியில் சேமிப்பு)", motion: "அசைவைக் குறை", contrast: "உயர் மாறுபாடு",
    textSize: "எழுத்து அளவு", normal: "இயல்பு", large: "பெரியது", xl: "மிகப் பெரியது",
    theme: "தோற்றம்", light: "வெளிச்சம்", dark: "இருள்", language: "மொழி",
    practices: "உள்ளமைந்த நடைமுறைகள்",
    items: [
      "உள்ளடக்கத்திற்குத் தாவும் இணைப்பு, தெளிவான தலைப்பு வரிசை.",
      "தெரியும் கவன வளையங்கள்; முழு விசைப்பலகை இயக்கம்; 44px இலக்குகள்.",
      "படிவக் குறிப்புகள், பிழை அறிவிப்புகள், நிறம் மட்டும் பொருள் அல்ல.",
      "விளக்கப்படங்களுடன் உரை அட்டவணைகள்; அலங்காரப் படங்கள் மறைப்பு.",
      "தானியங்கி ஒலி/ஒளி, மினுக்கல், நேரக் கட்டுப்பாடு இல்லை.",
      "200% பெரிதாக்கத்திலும் பாதுகாப்பான தளவமைப்பு.",
    ],
  },
};

export default function AccessibilityPage() {
  const { prefs, setPrefs } = usePrefs();
  const s = prefs.lang === "ta" ? STR.ta : STR.en;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker={s.kicker} title={s.title} desc={s.desc} />
      <Card data-testid="accessibility-settings" className="min-w-0">
        <h2 className="font-bold">{s.settings}</h2>
        <div className="mt-4 grid gap-3">
          <label className="flex items-center justify-between gap-3 text-sm"><span>{s.motion}</span><input type="checkbox" checked={prefs.reducedMotion} onChange={(e) => setPrefs({ reducedMotion: e.target.checked })} className="size-6 shrink-0" /></label>
          <label className="flex items-center justify-between gap-3 text-sm"><span>{s.contrast}</span><input type="checkbox" checked={prefs.contrast} onChange={(e) => setPrefs({ contrast: e.target.checked })} className="size-6 shrink-0" /></label>
          <label className="flex items-center justify-between gap-3 text-sm"><span>{s.textSize}</span><select value={prefs.textSize} onChange={(e) => setPrefs({ textSize: e.target.value as "normal" | "large" | "xl" })} className="max-w-[60%] rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="normal">{s.normal}</option><option value="large">{s.large}</option><option value="xl">{s.xl}</option></select></label>
          <label className="flex items-center justify-between gap-3 text-sm"><span>{s.theme}</span><select value={prefs.theme} onChange={(e) => setPrefs({ theme: e.target.value as "light" | "dark" })} className="max-w-[60%] rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="light">{s.light}</option><option value="dark">{s.dark}</option></select></label>
          <label className="flex items-center justify-between gap-3 text-sm"><span>{s.language}</span><select value={prefs.lang} onChange={(e) => setPrefs({ lang: e.target.value as "en" | "ta" })} className="max-w-[60%] rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="en">English</option><option value="ta">தமிழ்</option></select></label>
        </div>
      </Card>
      <Card className="mt-4 min-w-0">
        <h2 className="font-bold">{s.practices}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {s.items.map((item) => <li key={item} className="break-words">{item}</li>)}
        </ul>
      </Card>
    </div>
  );
}
