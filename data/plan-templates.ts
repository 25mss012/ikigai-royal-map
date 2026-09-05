import type { PlanDay } from "@/types";
import { uid } from "@/lib/utils";

interface Template { category: PlanDay["category"]; taskEn: string; taskTa: string; minutes: number; difficulty: 1|2|3; whyEn: string; whyTa: string; promptEn: string; promptTa: string; }

const WEEK: Template[] = [
  { category: "Explore", taskEn: "Write down three activities that give you energy.", taskTa: "ஆற்றல் தரும் மூன்று செயல்களை எழுதுங்கள்.", minutes: 10, difficulty: 1, whyEn: "Naming energy sources reveals patterns.", whyTa: "ஆற்றல் மூலங்களைக் குறிப்பது வடிவங்களைக் காட்டும்.", promptEn: "Which one could you repeat this week?", promptTa: "இந்த வாரம் எதை மீண்டும் செய்யலாம்?" },
  { category: "Learn", taskEn: "Spend 20 minutes on a beginner lesson in one interest.", taskTa: "ஒரு ஆர்வத்தில் 20 நிமிட தொடக்கப் பாடம்.", minutes: 20, difficulty: 1, whyEn: "Low-cost learning tests curiosity.", whyTa: "குறைந்த செலவுக் கற்றல் ஆர்வத்தைச் சோதிக்கும்.", promptEn: "What surprised you?", promptTa: "எது வியப்பு தந்தது?" },
  { category: "Connect", taskEn: "Ask someone what they think you are good at.", taskTa: "நீங்கள் எதில் சிறந்தவர் என ஒருவரிடம் கேளுங்கள்.", minutes: 10, difficulty: 1, whyEn: "Others often see strengths we miss.", whyTa: "நாம் காணாத திறனை மற்றவர் காண்பர்.", promptEn: "Did anything surprise you?", promptTa: "எதாவது வியப்பா?" },
  { category: "Create", taskEn: "Try a small version of something you postponed.", taskTa: "ஒத்திவைத்ததின் சிறு பதிப்பை முயலுங்கள்.", minutes: 20, difficulty: 2, whyEn: "Small starts beat perfect plans.", whyTa: "சிறு தொடக்கம் சரியான திட்டத்தை வெல்லும்.", promptEn: "How did starting feel?", promptTa: "தொடங்கியது எப்படி இருந்தது?" },
  { category: "Restore", taskEn: "Take a mindful walk or quiet observation (15 min).", taskTa: "15 நிமிட அமைதி நடை / கவனிப்பு.", minutes: 15, difficulty: 1, whyEn: "Rest restores attention for meaning.", whyTa: "ஓய்வு கவனத்தை மீட்கும்.", promptEn: "What did you notice?", promptTa: "எதைக் கவனித்தீர்கள்?" },
  { category: "Serve", taskEn: "Help someone with a small practical action.", taskTa: "ஒருவருக்குச் சிறு நடைமுறை உதவி.", minutes: 20, difficulty: 1, whyEn: "Usefulness is a quiet purpose source.", whyTa: "பயனுள்ளதாக உணர்வது அமைதி நோக்கம்.", promptEn: "How did helping feel?", promptTa: "உதவியது எப்படி இருந்தது?" },
  { category: "Reflect", taskEn: "Review what gave energy and what drained it.", taskTa: "ஆற்றல் தந்தது / குறைத்ததை மீள்பார்.", minutes: 15, difficulty: 1, whyEn: "Weekly review turns days into direction.", whyTa: "வார மீள்பார்வை நாட்களைத் திசையாக்கும்.", promptEn: "What deserves more or less next week?", promptTa: "அடுத்த வாரம் எது கூட / குறைய வேண்டும்?" },
];

const EXTRA: Template[] = [
  { category: "Explore", taskEn: "Visit a new place nearby (library, park, market).", taskTa: "அருகில் புது இடம் (நூலகம், பூங்கா) செல்லுங்கள்.", minutes: 30, difficulty: 2, whyEn: "New contexts spark curiosity.", whyTa: "புது சூழல் ஆர்வத்தைத் தூண்டும்.", promptEn: "What caught your eye?", promptTa: "எது கண்ணில் பட்டது?" },
  { category: "Learn", taskEn: "Teach someone one thing you learned.", taskTa: "கற்ற ஒன்றை ஒருவருக்குக் கற்பியுங்கள்.", minutes: 15, difficulty: 2, whyEn: "Teaching deepens learning.", whyTa: "கற்பித்தல் கற்றலை ஆழமாக்கும்.", promptEn: "What became clearer?", promptTa: "எது தெளிவானது?" },
  { category: "Create", taskEn: "Make something imperfect and share it with one person.", taskTa: "குறையுடன் ஒன்றைச் செய்து ஒருவருடன் பகிருங்கள்.", minutes: 25, difficulty: 2, whyEn: "Low-stakes making builds courage.", whyTa: "குறைந்த அழுத்தப் படைப்பு துணிவு தரும்.", promptEn: "What did you enjoy in the process?", promptTa: "செயல்முறையில் எது மகிழ்ச்சி?" },
  { category: "Serve", taskEn: "Tidy or improve a shared space for 15 minutes.", taskTa: "பொது இடத்தை 15 நிமிடம் சுத்தம் செய்யுங்கள்.", minutes: 15, difficulty: 1, whyEn: "Care for place is care for people.", whyTa: "இடப் பராமரிப்பு மனிதப் பராமரிப்பு.", promptEn: "Who might benefit?", promptTa: "யார் பயன் பெறுவர்?" },
  { category: "Connect", taskEn: "Write a short thank-you note.", taskTa: "குறு நன்றிக் குறிப்பு எழுதுங்கள்.", minutes: 10, difficulty: 1, whyEn: "Gratitude strengthens bonds.", whyTa: "நன்றி உறவை வலுக்கும்.", promptEn: "How did it feel to send?", promptTa: "அனுப்பியது எப்படி இருந்தது?" },
  { category: "Restore", taskEn: "Keep a gentle no-screen hour before sleep.", taskTa: "உறக்கத்திற்கு முன் ஒரு மணி திரையின்மை.", minutes: 60, difficulty: 2, whyEn: "Evenings shape mornings.", whyTa: "மாலை காலையை வடிக்கும்.", promptEn: "How was your rest?", promptTa: "ஓய்வு எப்படி இருந்தது?" },
  { category: "Reflect", taskEn: "Write: continue / stop / explore next.", taskTa: "எழுதுக: தொடர் / நிறுத்து / ஆராய்.", minutes: 15, difficulty: 1, whyEn: "Naming choices creates direction.", whyTa: "தேர்வுகளைக் குறிப்பது திசை தரும்.", promptEn: "What is your next 7-day test?", promptTa: "அடுத்த 7 நாள் சோதனை எது?" },
];

export function buildPlan(startDateISO: string | null): PlanDay[] {
  const days: PlanDay[] = [];
  const base = startDateISO ? new Date(startDateISO + "T00:00:00") : new Date();
  for (let i = 0; i < 30; i++) {
    const tpl = i < 7 ? WEEK[i] : i === 29
      ? { category: "Reflect" as const, taskEn: "Final review: what I learned, continue, stop, explore next + my next 7-day experiment.", taskTa: "இறுதி மீள்பார்வை: கற்றது, தொடர், நிறுத்து, ஆராய் + அடுத்த 7 நாள் சோதனை.", minutes: 30, difficulty: 2 as const, whyEn: "Synthesis turns 30 days into direction.", whyTa: "தொகுப்பு 30 நாட்களைத் திசையாக்கும்.", promptEn: "What is your next experiment?", promptTa: "அடுத்த சோதனை எது?" }
      : EXTRA[(i - 7) % EXTRA.length];
    const d = new Date(base); d.setDate(d.getDate() + i);
    days.push({
      day: i + 1, category: tpl.category, taskEn: tpl.taskEn, taskTa: tpl.taskTa,
      minutes: tpl.minutes, difficulty: tpl.difficulty, whyEn: tpl.whyEn, whyTa: tpl.whyTa,
      promptEn: tpl.promptEn, promptTa: tpl.promptTa, status: "todo",
      scheduledDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      // id not in type; keep day as key
    });
  }
  return days;
}

export function planProgress(days: PlanDay[]): { done: number; skipped: number; pct: number; currentDay: number } {
  const done = days.filter((d) => d.status === "done").length;
  const skipped = days.filter((d) => d.status === "skipped").length;
  const currentDay = days.find((d) => d.status === "todo")?.day ?? 30;
  return { done, skipped, pct: Math.round((done / Math.max(1, days.length)) * 100), currentDay };
}

export { uid };
