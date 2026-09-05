"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { asRecord, getJSON, setJSON } from "@/lib/storage";
import { t } from "@/data/translations";
import type { Prefs } from "@/types";

const DEFAULTS: Prefs = { lang: "en", theme: "light", contrast: false, textSize: "normal", reducedMotion: false };

interface Ctx {
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;
  tr: (key: string) => string;
}

const PrefsCtx = createContext<Ctx>({ prefs: DEFAULTS, setPrefs: () => {}, tr: (k) => k });

export function Providers({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = asRecord(getJSON<unknown>(STORAGE_KEYS.prefs, {})) as Partial<Prefs>;
    const merged = { ...DEFAULTS, ...saved };
    // respect OS reduced motion on first run
    try {
      if (!saved.reducedMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        merged.reducedMotion = true;
      }
    } catch { /* ignore */ }
    setPrefsState(merged);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.lang = prefs.lang === "ta" ? "ta" : "en";
    root.dataset.theme = prefs.theme;
    root.dataset.contrast = prefs.contrast ? "high" : "normal";
    root.dataset.motion = prefs.reducedMotion ? "reduced" : "full";
    root.dataset.textsize = prefs.textSize;
    try { document.body.classList.toggle("dark", prefs.theme === "dark"); } catch { /* ignore */ }
    setJSON(STORAGE_KEYS.prefs, prefs);
  }, [prefs, ready]);

  const setPrefs = (p: Partial<Prefs>) => setPrefsState((s) => ({ ...s, ...p }));
  const tr = (key: string) => t(prefs.lang, key);

  return <PrefsCtx.Provider value={{ prefs, setPrefs, tr }}>{children}</PrefsCtx.Provider>;
}

export function usePrefs(): Ctx {
  return useContext(PrefsCtx);
}
