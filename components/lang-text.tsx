"use client";
import type { ReactNode } from "react";
import { usePrefs } from "./providers";

/** Render Tamil when selected, English otherwise. Keeps server pages static. */
export function LangText({ en, ta }: { en: ReactNode; ta: ReactNode }) {
  const { prefs } = usePrefs();
  return <>{prefs.lang === "ta" ? ta : en}</>;
}
