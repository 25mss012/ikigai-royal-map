"use client";
import { usePrefs } from "@/components/providers";
import { Card, SectionHeading } from "@/components/ui";

export default function AccessibilityPage() {
  const { prefs, setPrefs } = usePrefs();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="Accessibility" title="Comfortable for everyone" desc="Keyboard, screen reader, touch, and motion friendly." />
      <Card>
        <h2 className="font-bold">Display settings (saved in this browser)</h2>
        <div className="mt-4 grid gap-3">
          <label className="flex items-center justify-between gap-3 text-sm">Reduce motion<input type="checkbox" checked={prefs.reducedMotion} onChange={(e) => setPrefs({ reducedMotion: e.target.checked })} className="size-6" /></label>
          <label className="flex items-center justify-between gap-3 text-sm">High contrast<input type="checkbox" checked={prefs.contrast} onChange={(e) => setPrefs({ contrast: e.target.checked })} className="size-6" /></label>
          <label className="flex items-center justify-between gap-3 text-sm">Text size<select value={prefs.textSize} onChange={(e) => setPrefs({ textSize: e.target.value as "normal" | "large" | "xl" })} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="normal">Normal</option><option value="large">Large</option><option value="xl">Extra large</option></select></label>
          <label className="flex items-center justify-between gap-3 text-sm">Theme<select value={prefs.theme} onChange={(e) => setPrefs({ theme: e.target.value as "light" | "dark" })} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="light">Light</option><option value="dark">Dark</option></select></label>
          <label className="flex items-center justify-between gap-3 text-sm">Language<select value={prefs.lang} onChange={(e) => setPrefs({ lang: e.target.value as "en" | "ta" })} className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"><option value="en">English</option><option value="ta">தமிழ்</option></select></label>
        </div>
      </Card>
      <Card className="mt-4">
        <h2 className="font-bold">Built-in practices</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>Skip-to-content link, semantic landmarks, heading hierarchy.</li>
          <li>Visible focus rings; full keyboard operation; 44px targets.</li>
          <li>Form labels, error announcements, no colour-only meaning.</li>
          <li>Charts always paired with text tables; decorative images hidden from assistive tech.</li>
          <li>No autoplay, flashing, or timed interactions.</li>
          <li>Zoom to 200%-safe responsive layout.</li>
        </ul>
      </Card>
    </div>
  );
}
