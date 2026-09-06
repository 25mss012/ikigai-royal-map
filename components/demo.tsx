"use client";
import { useEffect, useState } from "react";
import { exitDemo, isDemoActive } from "@/lib/demo";
import { usePrefs } from "./providers";

/** Persistent banner while demo data is active. Always offers a one-click exit. */
export function DemoBanner() {
  const { prefs } = usePrefs();
  const ta = prefs.lang === "ta";
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isDemoActive());
    const sync = () => setActive(isDemoActive());
    window.addEventListener("ikigai:demo", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ikigai:demo", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!active) return null;
  return (
    <div
      data-testid="demo-banner"
      role="status"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-imperial/60 bg-midnight px-4 py-3 text-champagne dark:bg-black"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <p className="text-sm">
          <strong>{ta ? "செயல்விளக்கத் தரவு" : "Demo data"}</strong>
          {" — "}
          {ta
            ? "இது மாதிரித் தரவு. உங்கள் தரவு பாதுகாப்பாக உள்ளது."
            : "You are viewing sample data. Your own data is safely stored."}
        </p>
        <button
          data-testid="demo-exit"
          onClick={() => { exitDemo(); window.location.reload(); }}
          className="min-h-[44px] rounded-full bg-imperial px-5 py-2 text-sm font-semibold text-obsidian"
        >
          {ta ? "செயல்விளக்கத்திலிருந்து வெளியேறு" : "Exit demo"}
        </button>
      </div>
    </div>
  );
}

/** Entry button: snapshots real data, loads samples, reloads into the journey. */
export function DemoEntryButton({ label }: { label?: string }) {
  const { prefs } = usePrefs();
  const ta = prefs.lang === "ta";
  const [failed, setFailed] = useState(false);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        data-testid="demo-enter"
        onClick={() => {
          import("@/lib/demo").then((m) => {
            if (m.enterDemo()) window.location.href = "/assessment/results";
            else setFailed(true);
          });
        }}
        className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"
      >
        {label ?? (ta ? "மாதிரித் தரவுடன் முயலுங்கள்" : "Try with sample data")}
      </button>
      {failed && (
        <span role="alert" className="text-sm text-error">
          {ta ? "செயல்விளக்கத்தைத் தொடங்க முடியவில்லை." : "Could not start the demo."}
        </span>
      )}
    </span>
  );
}
