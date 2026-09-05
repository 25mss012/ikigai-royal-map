import { ASSESSMENT_QUESTIONS } from "@/data/assessment-questions";
import type { AnswerValue, AssessmentResult, DimensionId, DimensionScore } from "@/types";

export function scoreDimension(dimension: DimensionId, answers: Record<string, AnswerValue>): DimensionScore {
  const qs = ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dimension);
  const valid = qs.map((q) => answers[q.id]).filter((v): v is 1 | 2 | 3 | 4 | 5 => typeof v === "number");
  if (valid.length === 0) {
    return { id: dimension, average: null, percentage: null, answered: 0, total: qs.length };
  }
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  const pct = Math.round(((avg - 1) / 4) * 100);
  return { id: dimension, average: Math.round(avg * 100) / 100, percentage: pct, answered: valid.length, total: qs.length };
}

export function scoreAll(answers: Record<string, AnswerValue>): AssessmentResult {
  const ids: DimensionId[] = ["love", "strength", "contribution", "values", "flow"];
  const scores = ids.map((id) => scoreDimension(id, answers));
  const answeredTotal = Object.values(answers).filter((v) => typeof v === "number").length;
  const completionPct = Math.round((answeredTotal / ASSESSMENT_QUESTIONS.length) * 100);
  const provisional = answeredTotal < ASSESSMENT_QUESTIONS.length;
  const withPct = scores.filter((s) => s.percentage !== null);
  const overall = withPct.length ? Math.round(withPct.reduce((a, s) => a + (s.percentage as number), 0) / withPct.length) : null;
  let strongest: DimensionId | null = null;
  let growth: DimensionId | null = null;
  let balance: number | null = null;
  if (withPct.length >= 2) {
    const sorted = [...withPct].sort((a, b) => (b.percentage as number) - (a.percentage as number));
    strongest = sorted[0].id;
    growth = sorted[sorted.length - 1].id;
    balance = 100 - ((sorted[0].percentage as number) - (sorted[sorted.length - 1].percentage as number));
  } else if (withPct.length === 1) {
    strongest = withPct[0].id; growth = withPct[0].id; balance = 100;
  }
  return {
    scores, overall, strongest, growth, balance,
    completionPct, provisional,
    archetype: pickArchetype(strongest, growth),
    createdAt: new Date().toISOString(),
  };
}

export function pickArchetype(strongest: DimensionId | null, growth: DimensionId | null): string {
  if (!strongest) return "The Balanced Beginner";
  const key = `${strongest}+${growth ?? "none"}`;
  const map: Record<string, string> = {
    "love+strength": "The Curious Builder",
    "love+contribution": "The Quiet Creator",
    "love+values": "The Purposeful Learner",
    "love+flow": "The Practical Explorer",
    "strength+love": "The Curious Builder",
    "strength+contribution": "The Practical Explorer",
    "contribution+love": "The Caring Guide",
    "contribution+values": "The Community Catalyst",
    "values+contribution": "The Community Catalyst",
    "values+strength": "The Reflective Strategist",
    "flow+love": "The Quiet Creator",
  };
  if (map[key]) return map[key];
  const fallback: Record<DimensionId, string> = {
    love: "The Curious Builder",
    strength: "The Practical Explorer",
    contribution: "The Caring Guide",
    values: "The Reflective Strategist",
    flow: "The Purposeful Learner",
  };
  return fallback[strongest];
}

export function flowScore(focus: number, enjoyment: number, difficulty: number, confidence: number): number {
  const challengeFit = 5 - Math.abs(difficulty - confidence);
  const s = (focus + enjoyment + challengeFit) / 3;
  return Math.round(s * 10) / 10;
}
