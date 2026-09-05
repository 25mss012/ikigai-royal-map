import type { Metadata } from "next";
import { Card, SectionHeading, Notice } from "@/components/ui";
import { MEDICAL_NOTICE_EN } from "@/lib/constants";

export const metadata: Metadata = { title: "Responsible use & copyright", description: "Educational scope, safety, and copyright statement.", alternates: { canonical: "/responsible-use" } };

export default function ResponsibleUse() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="Trust" title="Responsible use & copyright" />
      <div className="grid gap-4">
        <Card><h2 className="font-bold">Educational scope</h2><p className="mt-2 text-sm">This site is a reflective learning tool. It is not medical, psychological, career, financial, or religious advice. Scores are provisional indicators. {MEDICAL_NOTICE_EN}</p></Card>
        <Card><h2 className="font-bold">Safety</h2><p className="mt-2 text-sm">No extreme diets, unsafe exercise, or promises of longevity. If you face a crisis, contact local emergency services, a trusted person, or a qualified professional. This site cannot act as a therapist.</p></Card>
        <Card><h2 className="font-bold">Copyright & responsible use</h2><p className="mt-2 text-sm">All essays, questions, and diagrams are original. No book chapters, passages, illustrations, or PDFs are reproduced. The reference book was not uploaded to this site or repository.</p><p className="mt-2 text-sm">Short ideas (purpose, flow, community, moderation) are general concepts. Any brief quotation elsewhere would require attribution and fair-use limits — none are used here.</p></Card>
        <Notice>This website is an independent educational companion inspired by general themes associated with Ikigai. It is not affiliated with, sponsored by, or endorsed by the authors or publisher of any book.</Notice>
      </div>
    </div>
  );
}
