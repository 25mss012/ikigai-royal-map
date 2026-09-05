export type DimensionId = "love" | "strength" | "contribution" | "values" | "flow";

export interface DimensionMeta {
  id: DimensionId;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  color: string;
}

export interface AssessmentQuestion {
  id: string;
  dimension: DimensionId;
  en: string;
  ta: string;
  exampleEn: string;
  exampleTa: string;
}

export type AnswerValue = 1 | 2 | 3 | 4 | 5 | null; // null = not sure

export interface AssessmentState {
  answers: Record<string, AnswerValue>;
  startedAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface DimensionScore {
  id: DimensionId;
  average: number | null;
  percentage: number | null;
  answered: number;
  total: number;
}

export interface AssessmentResult {
  scores: DimensionScore[];
  overall: number | null;
  strongest: DimensionId | null;
  growth: DimensionId | null;
  balance: number | null;
  completionPct: number;
  provisional: boolean;
  archetype: string;
  createdAt: string;
}

export interface FlowEntry {
  id: string;
  activity: string;
  date: string;
  timeOfDay: string;
  durationMin: number;
  focus: number;
  enjoyment: number;
  difficulty: number;
  confidence: number;
  setting: "alone" | "with-others" | "online" | "outdoors" | "mixed";
  notes: string;
  flowScore: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  purpose: number;
  text: string;
  tags: string[];
  activity?: string;
  gratitude?: string;
  challenge?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlanStatus = "todo" | "done" | "skipped";

export interface PlanDay {
  day: number;
  category: "Explore" | "Learn" | "Create" | "Serve" | "Connect" | "Restore" | "Reflect";
  taskEn: string;
  taskTa: string;
  minutes: number;
  difficulty: 1 | 2 | 3;
  whyEn: string;
  whyTa: string;
  promptEn: string;
  promptTa: string;
  status: PlanStatus;
  scheduledDate: string | null;
}

export interface CircleEntry {
  id: string;
  label: string;
  kind: string;
  supportReceived: string;
  supportGiven: string;
  lastConnection: string;
  nextIntention: string;
}

export interface Prefs {
  lang: "en" | "ta";
  theme: "light" | "dark";
  contrast: boolean;
  textSize: "normal" | "large" | "xl";
  reducedMotion: boolean;
}
