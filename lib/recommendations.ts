import type { AssessmentResult, DimensionId } from "@/types";

export interface Experiment { titleEn: string; titleTa: string; detailEn: string; detailTa: string; minutes: number; kind: "personal" | "learning" | "contribution"; }

const BY_DIMENSION: Record<DimensionId, Experiment[]> = {
  love: [
    { titleEn: "Energy diary (3 days)", titleTa: "ஆற்றல் நாட்குறிப்பு (3 நாட்கள்)", detailEn: "Each evening, note one activity that gave energy and one that drained it. 10 minutes.", detailTa: "ஒவ்வொரு மாலையும் ஆற்றல் தந்த ஒரு செயலையும், குறைத்த ஒரு செயலையும் எழுதுங்கள். 10 நிமிடம்.", minutes: 10, kind: "personal" },
    { titleEn: "Curiosity sampling", titleTa: "ஆர்வ மாதிரி", detailEn: "Spend 20 minutes on a beginner tutorial in a topic you keep returning to.", detailTa: "நீங்கள் திரும்பத் திரும்ப நாடும் தலைப்பில் 20 நிமிட தொடக்கப் பாடம்.", minutes: 20, kind: "learning" },
    { titleEn: "Share a small joy", titleTa: "சிறு மகிழ்ச்சியைப் பகிருங்கள்", detailEn: "Teach someone one tiny thing you enjoy. Notice how it feels.", detailTa: "நீங்கள் விரும்பும் சிறு விஷயத்தை ஒருவருக்குக் கற்றுக்கொடுங்கள்.", minutes: 15, kind: "contribution" },
  ],
  strength: [
    { titleEn: "Ask for feedback", titleTa: "கருத்து கேளுங்கள்", detailEn: "Ask one person: what do I help with naturally? Write down the answer.", detailTa: "ஒருவரிடம் கேளுங்கள்: நான் இயல்பாக எதில் உதவுகிறேன்?", minutes: 10, kind: "personal" },
    { titleEn: "Deliberate 20 minutes", titleTa: "20 நிமிட பயிற்சி", detailEn: "Practise one sub-skill slowly for 20 minutes. Record what improved.", detailTa: "ஒரு துணைத் திறனை 20 நிமிடம் மெதுவாகப் பயிற்சி செய்யுங்கள்.", minutes: 20, kind: "learning" },
    { titleEn: "Help with your strength", titleTa: "திறனால் உதவுங்கள்", detailEn: "Offer 30 minutes of help using something you are already good at.", detailTa: "உங்களுக்கு வரும் திறனால் 30 நிமிடம் உதவுங்கள்.", minutes: 30, kind: "contribution" },
  ],
  contribution: [
    { titleEn: "Care mapping", titleTa: "அக்கறை வரைபடம்", detailEn: "List 3 people or problems you genuinely care about. Pick one small action.", detailTa: "நீங்கள் உண்மையில் அக்கறை கொள்ளும் 3 நபர்/பிரச்சினைகளை எழுதுங்கள்.", minutes: 15, kind: "personal" },
    { titleEn: "Learn the context", titleTa: "சூழலை அறியுங்கள்", detailEn: "Read one reliable short article about a problem you care about.", detailTa: "நீங்கள் அக்கறை கொள்ளும் பிரச்சினை பற்றி நம்பகமான சிறு கட்டுரை படியுங்கள்.", minutes: 20, kind: "learning" },
    { titleEn: "One practical act", titleTa: "ஒரு நடைமுறை உதவி", detailEn: "Do one reversible, low-cost helpful act this week (errand, note, cleanup).", detailTa: "இந்த வாரம் குறைந்த செலவில் ஒரு உதவி செய்யுங்கள்.", minutes: 30, kind: "contribution" },
  ],
  values: [
    { titleEn: "Values sentence", titleTa: "மதிப்பு வாக்கியம்", detailEn: "Finish: A meaningful day for me includes… Keep it to two lines.", detailTa: "நிறைவு செய்யுங்கள்: எனக்கு அர்த்தமுள்ள நாள் என்றால்… இரண்டு வரிகளில்.", minutes: 10, kind: "personal" },
    { titleEn: "Study one value", titleTa: "ஒரு மதிப்பைக் கற்கவும்", detailEn: "Choose one principle (e.g. honesty, care) and find one story about it.", detailTa: "ஒரு கொள்கையைத் தேர்ந்து அது பற்றிய ஒரு கதையைப் படியுங்கள்.", minutes: 20, kind: "learning" },
    { titleEn: "Act on a value", titleTa: "மதிப்பின்படி செயல்", detailEn: "Take one small decision this week guided by that value.", detailTa: "அந்த மதிப்பின்படி இந்த வாரம் ஒரு சிறு முடிவு எடுங்கள்.", minutes: 15, kind: "contribution" },
  ],
  flow: [
    { titleEn: "Friction audit", titleTa: "தடை ஆய்வு", detailEn: "Pick one activity. Remove one distraction (phone, noise) and retry 25 minutes.", detailTa: "ஒரு செயலைத் தேர்ந்து ஒரு தடையை நீக்கி 25 நிமிடம் முயலுங்கள்.", minutes: 25, kind: "personal" },
    { titleEn: "Right-size challenge", titleTa: "சவாலைச் சரிசெய்க", detailEn: "Make the task slightly easier or harder so it feels engaging, not boring or anxious.", detailTa: "சலிப்போ பதற்றமோ இல்லாமல் ஈடுபாடு தரும் அளவுக்குச் சவாலை மாற்றுங்கள்.", minutes: 20, kind: "learning" },
    { titleEn: "Invite company", titleTa: "துணையை அழையுங்கள்", detailEn: "Try the activity once alone and once with someone. Compare focus.", detailTa: "செயலை ஒருமுறை தனியாக, ஒருமுறை துணையுடன் முயன்று ஒப்பிடுங்கள்.", minutes: 30, kind: "contribution" },
  ],
};

export function experimentsFor(result: AssessmentResult | null): Experiment[] {
  const out: Experiment[] = [];
  if (!result || !result.strongest || !result.growth) {
    return [
      BY_DIMENSION.love[0], BY_DIMENSION.strength[1], BY_DIMENSION.contribution[2],
    ];
  }
  const s = BY_DIMENSION[result.strongest];
  const g = BY_DIMENSION[result.growth];
  out.push(s[0]);
  const learning = g[1].kind === "learning" ? g[1] : BY_DIMENSION.values[1];
  out.push(learning);
  const contrib = result.strongest === "contribution" ? BY_DIMENSION.contribution[2] : BY_DIMENSION.contribution[2];
  out.push(contrib);
  // Ensure one of each kind
  return [
    out.find((e) => e.kind === "personal") ?? BY_DIMENSION.love[0],
    out.find((e) => e.kind === "learning") ?? BY_DIMENSION.strength[1],
    out.find((e) => e.kind === "contribution") ?? BY_DIMENSION.contribution[2],
  ];
}

export function promptsFor(result: AssessmentResult | null, lang: "en" | "ta"): string[] {
  if (lang === "ta") {
    return [
      "இந்த வாரம் எந்தச் சிறு செயல் உங்களுக்கு அதிக ஆற்றல் தந்தது?",
      "யாருக்கு நீங்கள் பயனுள்ளதாக உணர்ந்தீர்கள்? அது ஏன்?",
      "அடுத்த 7 நாட்களில் நீங்கள் முயலக்கூடிய ஒரு சிறு பரிசோதனை எது?",
    ];
  }
  if (!result?.growth) return [
    "Which small activity gave you the most energy this week?",
    "When did you feel useful to someone else, and why?",
    "What is one small experiment you could try in the next 7 days?",
  ];
  const map: Record<string, string[]> = {
    love: ["What did you do last week purely because you wanted to?", "Which topic do you explore without being asked?", "What 20-minute version of that could you try tomorrow?"],
    strength: ["What do people ask you to help with?", "Which skill improved for you through practice?", "How could you use that strength to help someone this week?"],
    contribution: ["Who do you genuinely care about right now?", "What small improvement would you like to see near you?", "What is one reversible way to contribute this week?"],
    values: ["What would feel meaningful even if nobody praised it?", "Which principle guided a recent hard decision?", "What would you protect when choices get difficult?"],
    flow: ["When did you last lose track of time in a good way?", "Do you focus better alone, with others, or mixed?", "What one friction could you remove tomorrow?"],
  };
  return map[result.growth];
}
