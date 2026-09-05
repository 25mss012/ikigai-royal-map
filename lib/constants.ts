import type { DimensionMeta } from "@/types";

export const SITE = {
  name: "Ikigai — The Royal Map of Purpose",
  short: "Ikigai",
  taglineEn: "Discover what gives your life meaning, energy, connection, and direction.",
  taglineTa: "உங்கள் வாழ்வுக்கு அர்த்தம், ஆற்றல், தொடர்பு, திசை தருவதைக் கண்டறியுங்கள்.",
  url: "https://ikigai-royal-map.vercel.app",
} as const;

export const DIMENSIONS: DimensionMeta[] = [
  { id: "love", titleEn: "Love & Energy", titleTa: "விருப்பம் & ஆற்றல்", descEn: "What leaves you feeling more alive.", descTa: "எது உங்களை உயிர்ப்புடன் உணரச் செய்கிறது.", color: "#C9A227" },
  { id: "strength", titleEn: "Strengths & Skills", titleTa: "திறன்கள்", descEn: "What you can patiently work through and improve.", descTa: "நீங்கள் பொறுமையாகச் செய்து மேம்படுத்துவது.", color: "#174A45" },
  { id: "contribution", titleEn: "Contribution & Care", titleTa: "பங்களிப்பு & அக்கறை", descEn: "People, communities and problems you care about.", descTa: "நீங்கள் அக்கறை கொள்ளும் மனிதர்கள், சமூகங்கள்.", color: "#5A1E2A" },
  { id: "values", titleEn: "Values & Meaning", titleTa: "மதிப்புகள் & பொருள்", descEn: "Principles that guide difficult decisions.", descTa: "கடின முடிவுகளை வழிநடத்தும் கொள்கைகள்.", color: "#2E7D5B" },
  { id: "flow", titleEn: "Flow & Lifestyle Fit", titleTa: "ஒன்றிப்பு & வாழ்க்கைப் பொருத்தம்", descEn: "Settings and pace where you do your best.", descTa: "நீங்கள் சிறப்பாகச் செயல்படும் சூழல், வேகம்.", color: "#7A5C00" },
];

export const STORAGE_KEYS = {
  answers: "ikigai.v1.assessment-answers",
  result: "ikigai.v1.assessment-result",
  flow: "ikigai.v1.flow-entries",
  journal: "ikigai.v1.journal-entries",
  plan: "ikigai.v1.plan-state",
  circle: "ikigai.v1.circle-entries",
  prefs: "ikigai.v1.prefs",
} as const;

export const CRISIS_NOTICE_EN =
  "If you are going through a very difficult time, please reach out to someone you trust, a local support service, or emergency help in your area. This website is a reflective tool and cannot provide counselling.";
export const CRISIS_NOTICE_TA =
  "நீங்கள் மிகவும் கடினமான நேரத்தில் இருந்தால், நம்பிக்கையான ஒருவரையோ, உங்கள் பகுதியில் உள்ள உதவி சேவையையோ அணுகுங்கள். இந்த இணையதளம் சிந்தனைக் கருவி மட்டுமே; ஆலோசனை வழங்காது.";

export const MEDICAL_NOTICE_EN =
  "This is general educational information, not medical advice. Choose activities appropriate for your health and circumstances. Consult a qualified professional when needed.";
export const MEDICAL_NOTICE_TA =
  "இது பொதுவான கல்வித் தகவல் மட்டுமே, மருத்துவ ஆலோசனை அல்ல. உங்கள் உடல்நிலைக்கு ஏற்ற செயல்களைத் தேர்ந்தெடுங்கள். தேவைப்பட்டால் தகுதிவாய்ந்த நிபுணரை அணுகுங்கள்.";
