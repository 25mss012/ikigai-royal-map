import type { Metadata } from "next";
import { Card, SectionHeading, Notice } from "@/components/ui";
import { LangText } from "@/components/lang-text";
import { MEDICAL_NOTICE_EN, MEDICAL_NOTICE_TA } from "@/lib/constants";

export const metadata: Metadata = { title: "Responsible use & copyright", description: "Educational scope, safety, and copyright statement.", alternates: { canonical: "/responsible-use" } };

export default function ResponsibleUse() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker={<LangText en="Trust" ta="நம்பிக்கை" />} title={<LangText en="Responsible use & copyright" ta="பொறுப்பான பயன் & பதிப்புரிமை" />} />
      <div className="grid gap-4">
        <Card><h2 className="font-bold"><LangText en="Educational scope" ta="கல்வி எல்லை" /></h2><p className="mt-2 text-sm"><LangText en={<>This site is a reflective learning tool. It is not medical, psychological, career, financial, or religious advice. Scores are provisional indicators. {MEDICAL_NOTICE_EN}</>} ta={<>இது சிந்தனைக் கற்றல் கருவி. மருத்துவ, உளவியல், தொழில், நிதி, சமய ஆலோசனை அல்ல. மதிப்பெண்கள் தற்காலிகக் குறிகாட்டிகள். {MEDICAL_NOTICE_TA}</>} /></p></Card>
        <Card><h2 className="font-bold"><LangText en="Safety" ta="பாதுகாப்பு" /></h2><p className="mt-2 text-sm"><LangText en="No extreme diets, unsafe exercise, or promises of longevity. If you face a crisis, contact local emergency services, a trusted person, or a qualified professional. This site cannot act as a therapist." ta="தீவிர உணவுமுறை, பாதுகாப்பற்ற உடற்பயிற்சி, நீண்ட ஆயுள் வாக்குறுதிகள் இல்லை. நெருக்கடியில் உள்ளூர் அவசர உதவி, நம்பிக்கையானவர், தகுதிவாய்ந்த நிபுணரை அணுகுங்கள். இந்தத் தளம் ஆலோசகராகச் செயல்படாது." /></p></Card>
        <Card><h2 className="font-bold"><LangText en="Copyright & responsible use" ta="பதிப்புரிமை & பொறுப்பு" /></h2><p className="mt-2 text-sm"><LangText en="All essays, questions, and diagrams are original. No book chapters, passages, illustrations, or PDFs are reproduced. The reference book was not uploaded to this site or repository." ta="அனைத்து கட்டுரைகள், கேள்விகள், வரைபடங்கள் அசலானவை. எந்தப் புத்தக அத்தியாயம், பகுதி, படம், PDF-ம் மறுபதிப்பு செய்யப்படவில்லை." /></p><p className="mt-2 text-sm"><LangText en="Short ideas (purpose, flow, community, moderation) are general concepts. Any brief quotation elsewhere would require attribution and fair-use limits — none are used here." ta="குறு கருத்துகள் (நோக்கம், ஒன்றிப்பு, சமூகம், அளவு) பொதுக் கருத்துகள். சிறு மேற்கோளுக்கும் உரிமை குறிப்பு தேவை — இங்கு எதுவும் பயன்படுத்தப்படவில்லை." /></p></Card>
        <Notice><LangText en="This website is an independent educational companion inspired by general themes associated with Ikigai. It is not affiliated with, sponsored by, or endorsed by the authors or publisher of any book." ta="இந்த இணையதளம் இகிகையுடன் தொடர்புடைய பொதுக் கருத்துகளால் ஈர்க்கப்பட்ட சுயாதீனக் கல்வித் துணை. எந்தப் புத்தகத்தின் ஆசிரியர்களுடனோ பதிப்பாளருடனோ தொடர்பு, ஆதரவு, ஒப்புதல் இல்லை." /></Notice>
      </div>
    </div>
  );
}
