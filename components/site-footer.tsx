"use client";
import Link from "next/link";
import { usePrefs } from "./providers";

export function SiteFooter() {
  const { tr } = usePrefs();
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-midnight text-champagne/90 dark:bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-seriff text-xl font-bold text-champagne">Ikigai</p>
          <p className="mt-2 text-sm text-champagne/70">The Royal Map of Purpose. Private, practical, and kind.</p>
        </div>
        <nav aria-label="Explore">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-imperial-light">Explore</p>
          <ul className="space-y-1 text-sm">
            <li><Link className="hover:underline" href="/learn">Learn</Link></li>
            <li><Link className="hover:underline" href="/assessment">Assessment</Link></li>
            <li><Link className="hover:underline" href="/flow">Flow Lab</Link></li>
            <li><Link className="hover:underline" href="/plan">30-Day Plan</Link></li>
            <li><Link className="hover:underline" href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
        <nav aria-label="Trust">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-imperial-light">Trust</p>
          <ul className="space-y-1 text-sm">
            <li><Link className="hover:underline" href="/about">About</Link></li>
            <li><Link className="hover:underline" href="/privacy">Privacy</Link></li>
            <li><Link className="hover:underline" href="/accessibility">Accessibility</Link></li>
            <li><Link className="hover:underline" href="/responsible-use">Responsible Use & Copyright</Link></li>
          </ul>
        </nav>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-imperial-light">Private by default</p>
          <p className="text-sm text-champagne/70">No account needed. Your data stays in this browser unless you export it.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-champagne/70">
          <p>{tr("footer.disclaimer")}</p>
          <p className="mt-2">© {new Date().getFullYear()} Ikigai — The Royal Map of Purpose. Original educational content. No book text reproduced.</p>
        </div>
      </div>
    </footer>
  );
}
