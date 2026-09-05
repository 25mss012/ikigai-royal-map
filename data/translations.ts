export type Lang = "en" | "ta";

const en: Record<string, string> = {
  "nav.home": "Home", "nav.learn": "Learn", "nav.assessment": "Assessment", "nav.flow": "Flow Lab",
  "nav.plan": "30-Day Plan", "nav.journal": "Journal", "nav.circle": "Circle", "nav.dashboard": "Dashboard",
  "nav.about": "About", "nav.privacy": "Privacy", "nav.accessibility": "Accessibility", "nav.responsible": "Responsible Use",
  "cta.begin": "Begin Your Journey", "cta.explore": "Explore Ikigai", "cta.startAssessment": "Start Assessment",
  "cta.viewDashboard": "Dashboard", "cta.continue": "Continue", "cta.back": "Back", "cta.next": "Next",
  "cta.save": "Save", "cta.delete": "Delete", "cta.export": "Export", "cta.reset": "Reset",
  "cta.retry": "Try again", "cta.skip": "Skip", "cta.done": "Done", "cta.add": "Add",
  "common.loading": "Loading…", "common.empty": "Nothing here yet.",
  "hero.title": "Your purpose is not a destination. It is a direction.",
  "hero.subtitle": "A private, practical journey to understand what gives you energy, meaning, connection, and momentum.",
  "scale.1": "Not true for me", "scale.2": "Slightly true", "scale.3": "Sometimes true",
  "scale.4": "Mostly true", "scale.5": "Very true for me", "scale.unsure": "I am not sure",
  "footer.disclaimer": "This website is an independent educational companion inspired by general themes associated with Ikigai. It is not affiliated with, sponsored by, or endorsed by the authors or publisher of any book.",
  "privacy.journal": "Your journal is stored in this browser. Clearing browser data or changing devices may remove it unless you export it.",
};

const ta: Record<string, string> = {
  "nav.home": "முகப்பு", "nav.learn": "கற்க", "nav.assessment": "மதிப்பீடு", "nav.flow": "ஓட்ட ஆய்வகம்",
  "nav.plan": "30-நாள் திட்டம்", "nav.journal": "நாட்குறிப்பு", "nav.circle": "துணை வட்டம்", "nav.dashboard": "பலகை",
  "nav.about": "பற்றி", "nav.privacy": "தனியுரிமை", "nav.accessibility": "அணுகல்", "nav.responsible": "பொறுப்பான பயன்",
  "cta.begin": "பயணத்தைத் தொடங்குங்கள்", "cta.explore": "இகிகையை அறியுங்கள்", "cta.startAssessment": "மதிப்பீட்டைத் தொடங்கு",
  "cta.viewDashboard": "பலகை", "cta.continue": "தொடர்க", "cta.back": "பின்", "cta.next": "அடுத்து",
  "cta.save": "சேமி", "cta.delete": "நீக்கு", "cta.export": "ஏற்றுமதி", "cta.reset": "மீட்டமை",
  "cta.retry": "மீண்டும் முயல்க", "cta.skip": "தவிர்", "cta.done": "முடிந்தது", "cta.add": "சேர்",
  "common.loading": "ஏற்றுகிறது…", "common.empty": "இங்கு இன்னும் எதுவும் இல்லை.",
  "hero.title": "உங்கள் நோக்கம் சேருமிடம் அல்ல. அது ஒரு திசை.",
  "hero.subtitle": "உங்களுக்கு ஆற்றல், பொருள், தொடர்பு, உந்துதல் தருவதைப் புரிந்துகொள்ள தனிப்பட்ட, நடைமுறைப் பயணம்.",
  "scale.1": "எனக்குப் பொருந்தாது", "scale.2": "சிறிது பொருந்தும்", "scale.3": "சில நேரம் பொருந்தும்",
  "scale.4": "பெரும்பாலும் பொருந்தும்", "scale.5": "மிகவும் பொருந்தும்", "scale.unsure": "தெரியவில்லை",
  "footer.disclaimer": "இந்த இணையதளம் இகிகையுடன் தொடர்புடைய பொதுக் கருத்துகளால் ஈர்க்கப்பட்ட சுயாதீனக் கல்வித் துணை. எந்தப் புத்தகத்தின் ஆசிரியர்களுடனோ பதிப்பாளருடனோ தொடர்பு, ஆதரவு, ஒப்புதல் இல்லை.",
  "privacy.journal": "உங்கள் நாட்குறிப்பு இந்த உலாவியில் சேமிக்கப்படுகிறது. உலாவித் தரவை அழித்தாலோ வேறு சாதனம் மாறினாலோ ஏற்றுமதி செய்யாவிட்டால் அது நீங்கலாம்.",
};

export const translations: Record<Lang, Record<string, string>> = { en, ta };
export function t(lang: Lang, key: string): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}
