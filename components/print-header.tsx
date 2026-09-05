"use client";
import { useEffect, useState } from "react";
import { usePrefs } from "./providers";

/** Print-only header: site name + page title + generated date. Hidden on screen. */
export function PrintHeader({ titleEn, titleTa }: { titleEn: string; titleTa: string }) {
  const { prefs } = usePrefs();
  const [date, setDate] = useState("");
  useEffect(() => {
    try {
      setDate(new Date().toLocaleDateString(prefs.lang === "ta" ? "ta-IN" : "en-GB", { day: "numeric", month: "short", year: "numeric" }));
    } catch {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [prefs.lang ]);
  if (!date) return null;
  return (
    <div className="print-only" aria-hidden="true">
      <p><strong>Ikigai — The Royal Map of Purpose</strong></p>
      <p>{prefs.lang === "ta" ? titleTa : titleEn} · {date}</p>
    </div>
  );
}
