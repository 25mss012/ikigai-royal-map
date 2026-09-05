import type { Metadata } from "next";
import Link from "next/link";
import { Card, SectionHeading, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy", description: "How your data stays private in your browser.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="Privacy" title="Private by default" desc="No account. No tracking pixels. No sale of data." />
      <div className="grid gap-4">
        <Card><h2 className="font-bold">Where your data lives</h2><p className="mt-2 text-sm">Your data is stored locally in this browser. It is not uploaded by this application. Export your data before clearing browser storage or changing devices.</p><p className="mt-2 text-sm">Assessment answers, results, flow entries, journal, plan, and circle are stored in your browser’s localStorage under versioned keys starting with <code>ikigai.v1.</code>. Nothing is sent to any server by this application. Local storage is convenient, not encrypted — anyone with access to this browser profile could read it.</p></Card>
        <Card><h2 className="font-bold">Export</h2><p className="mt-2 text-sm">Download one versioned JSON file (<code>format: ikigai-export, version: 1</code>) containing your answers, results, flow, plan, journal, circle, and preferences — nothing else. Use Dashboard → Export all data. Store the file somewhere safe; it contains your private reflections.</p></Card>
        <Card><h2 className="font-bold">Import</h2><p className="mt-2 text-sm">On a new device or browser, use Dashboard → Import from file. Only files you exported from this app are accepted (JSON, 5 MB limit, validated before anything changes). You will see a preview of what the file contains, and replacing happens only after you confirm. Your current data stays untouched if the file is invalid.</p></Card>
        <Card><h2 className="font-bold">Delete</h2><p className="mt-2 text-sm">Delete single entries where they live, or everything at once (Dashboard → Delete all data, with confirmation). Clearing browser site data or uninstalling the browser profile also removes local data — export first.</p></Card>
        <Card><h2 className="font-bold">Limits of browser storage</h2><p className="mt-2 text-sm">Clearing browser data, using private mode, changing devices or browsers may remove your data. Private browsing may block storage entirely — the app then keeps data only in memory until you close the tab. Export JSON/Markdown regularly from Dashboard, Journal, Flow, and Results.</p></Card>
        <Card><h2 className="font-bold">Your controls</h2><ul className="mt-2 list-disc pl-5 text-sm"><li>Export all data (Dashboard → Export all data).</li><li>Import a previous export (Dashboard → Import from file).</li><li>Delete per-item or per-section with confirmation.</li><li>Delete everything (Dashboard → Delete all data).</li></ul>
        <p className="mt-3"><Link href="/dashboard" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Open Dashboard data controls</Link></p></Card>
        <Card><h2 className="font-bold">What we do not collect</h2><p className="mt-2 text-sm">No analytics unless you self-host and configure it. No advertising identifiers. No personal data beyond what you type — and that stays with you.</p></Card>
        <Notice>No API keys are required. No backend is used in version one.</Notice>
      </div>
    </div>
  );
}
