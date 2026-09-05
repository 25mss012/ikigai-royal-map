import Link from "next/link";
import { LangText } from "@/components/lang-text";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">404</p>
      <h1 className="mt-2 break-words text-4xl font-bold"><LangText en="This path wandered off the map" ta="இந்தப் பாதை வரைபடத்தை விட்டு விலகிவிட்டது" /></h1>
      <p className="mt-3 text-[var(--muted)]"><LangText en="The page you asked for does not exist. Your saved data is untouched." ta="நீங்கள் கேட்ட பக்கம் இல்லை. உங்கள் சேமித்த தரவு பாதுகாப்பாக உள்ளது." /></p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian"><LangText en="Home" ta="முகப்பு" /></Link>
        <Link href="/dashboard" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"><LangText en="Dashboard" ta="பலகை" /></Link>
      </div>
    </div>
  );
}
