import type { Metadata } from "next";
import { Card, SectionHeading, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy", description: "How your data stays private in your browser.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="Privacy" title="Private by default" desc="No account. No tracking pixels. No sale of data." />
      <div className="grid gap-4">
        <Card><h2 className="font-bold">Where your data lives</h2><p className="mt-2 text-sm">Assessment answers, results, flow entries, journal, plan, and circle are stored in your browser’s localStorage under keys starting with <code>ikigai.v1.</code>. Nothing is sent to any server by this application.</p></Card>
        <Card><h2 className="font-bold">Limits of browser storage</h2><p className="mt-2 text-sm">Clearing browser data, using private mode, changing devices or browsers may remove your data. Export JSON/Markdown regularly from Dashboard, Journal, Flow, and Results.</p></Card>
        <Card><h2 className="font-bold">Your controls</h2><ul className="mt-2 list-disc pl-5 text-sm"><li>Export all data (Dashboard → Export all data).</li><li>Delete per-item or per-section with confirmation.</li><li>Delete everything (Dashboard → Delete all data).</li></ul></Card>
        <Card><h2 className="font-bold">What we do not collect</h2><p className="mt-2 text-sm">No analytics unless you self-host and configure it. No advertising identifiers. No personal data beyond what you type — and that stays with you.</p></Card>
        <Notice>No API keys are required. No backend is used in version one.</Notice>
      </div>
    </div>
  );
}
