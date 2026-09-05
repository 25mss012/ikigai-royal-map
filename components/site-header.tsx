"use client";
import Link from "next/link";
import { useState } from "react";
import { Compass, Menu, X } from "lucide-react";
import { usePrefs } from "./providers";

const LINKS = [
  { href: "/", key: "nav.home" }, { href: "/learn", key: "nav.learn" },
  { href: "/assessment", key: "nav.assessment" }, { href: "/flow", key: "nav.flow" },
  { href: "/plan", key: "nav.plan" }, { href: "/journal", key: "nav.journal" },
  { href: "/circle", key: "nav.circle" }, { href: "/dashboard", key: "nav.dashboard" },
];

export function SiteHeader() {
  const { prefs, setPrefs, tr } = usePrefs();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-seriff text-xl font-bold" aria-label="Ikigai home">
          <span className="grid size-9 place-items-center rounded-full bg-midnight text-champagne dark:bg-imperial dark:text-obsidian" aria-hidden="true"><Compass size={18} /></span>
          <span>Ikigai <span className="hidden font-sans text-xs font-normal text-[var(--muted)] sm:inline">· Royal Map of Purpose</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="compact-hit rounded-full px-3 text-sm hover:bg-black/5 dark:hover:bg-white/10">{tr(l.key)}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button className="compact-hit rounded-full border border-[var(--border)] px-3 text-sm" onClick={() => setPrefs({ lang: prefs.lang === "en" ? "ta" : "en" })} aria-label="Switch language">
            {prefs.lang === "en" ? "தமிழ்" : "English"}
          </button>
          <button className="compact-hit rounded-full border border-[var(--border)] px-3 text-sm" onClick={() => setPrefs({ theme: prefs.theme === "dark" ? "light" : "dark" })} aria-label="Toggle theme">
            {prefs.theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
          <Link href="/assessment" className="compact-hit rounded-full bg-midnight px-4 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">{tr("cta.startAssessment")}</Link>
        </div>
        <button className="grid size-11 place-items-center rounded-full border border-[var(--border)] lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[var(--border)] px-4 py-3 lg:hidden" aria-label="Mobile">
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">{tr(l.key)}</Link></li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-full border border-[var(--border)] px-3 py-2 text-sm" onClick={() => setPrefs({ lang: prefs.lang === "en" ? "ta" : "en" })}>{prefs.lang === "en" ? "தமிழ்" : "English"}</button>
            <button className="flex-1 rounded-full border border-[var(--border)] px-3 py-2 text-sm" onClick={() => setPrefs({ theme: prefs.theme === "dark" ? "light" : "dark" })}>{prefs.theme === "dark" ? "☀ Light" : "☾ Dark"}</button>
          </div>
        </nav>
      )}
    </header>
  );
}
