import { z } from "zod";
import { STORAGE_KEYS } from "@/lib/constants";
import { getRaw } from "@/lib/storage";

export const EXPORT_FORMAT = "ikigai-export" as const;
export const EXPORT_VERSION = 1 as const;
export const APP_VERSION = "1.2.0" as const;
/** Refuse files larger than this (bytes) before parsing. */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const answerValue = z.union([z.number().int().min(1).max(5), z.null()]);
const assessmentSchema = z.record(z.string(), answerValue);

const dimensionScoreSchema = z.object({
  id: z.string(),
  average: z.number().nullable(),
  percentage: z.number().nullable(),
  answered: z.number(),
  total: z.number(),
});
const resultSchema = z.object({
  scores: z.array(dimensionScoreSchema),
  overall: z.number().nullable(),
  strongest: z.string().nullable(),
  growth: z.string().nullable(),
  balance: z.number().nullable(),
  completionPct: z.number(),
  provisional: z.boolean(),
  archetype: z.string(),
  createdAt: z.string(),
});

const flowEntrySchema = z.object({
  id: z.string().default(""),
  activity: z.string().min(1).max(80),
  date: z.string().min(1),
  timeOfDay: z.string().default(""),
  durationMin: z.coerce.number().min(1).max(1440),
  focus: z.coerce.number().min(1).max(5),
  enjoyment: z.coerce.number().min(1).max(5),
  difficulty: z.coerce.number().min(1).max(5),
  confidence: z.coerce.number().min(1).max(5),
  setting: z.enum(["alone", "with-others", "online", "outdoors", "mixed"]).catch("alone"),
  notes: z.string().max(2000).default(""),
  flowScore: z.coerce.number().default(0),
});

const planDaySchema = z.object({
  day: z.coerce.number(),
  category: z.enum(["Explore", "Learn", "Create", "Serve", "Connect", "Restore", "Reflect"]).catch("Explore"),
  taskEn: z.string().default(""),
  taskTa: z.string().default(""),
  minutes: z.coerce.number().default(10),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).catch(1),
  whyEn: z.string().default(""),
  whyTa: z.string().default(""),
  promptEn: z.string().default(""),
  promptTa: z.string().default(""),
  status: z.enum(["todo", "done", "skipped"]).catch("todo"),
  scheduledDate: z.string().nullable().default(null),
});

const journalEntrySchema = z.object({
  id: z.string().default(""),
  date: z.string().min(1),
  mood: z.coerce.number().min(1).max(5),
  energy: z.coerce.number().min(1).max(5),
  purpose: z.coerce.number().min(1).max(5),
  text: z.string().min(1).max(10000),
  tags: z.array(z.string()).default([]),
  activity: z.string().max(120).default(""),
  gratitude: z.string().max(2000).default(""),
  challenge: z.string().max(2000).default(""),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
});

const circleEntrySchema = z.object({
  id: z.string().default(""),
  label: z.string().min(1).max(60),
  kind: z.string().max(60).default("Friend"),
  supportReceived: z.string().max(500).default(""),
  supportGiven: z.string().max(500).default(""),
  lastConnection: z.string().default(""),
  nextIntention: z.string().max(500).default(""),
});

const prefsSchema = z.object({
  lang: z.enum(["en", "ta"]).catch("en"),
  theme: z.enum(["light", "dark"]).catch("light"),
  contrast: z.boolean().catch(false),
  textSize: z.enum(["normal", "large", "xl"]).catch("normal"),
  reducedMotion: z.boolean().catch(false),
});

export const exportDataSchema = z.object({
  assessment: assessmentSchema.default({}),
  results: resultSchema.nullable().default(null),
  flow: z.array(flowEntrySchema).default([]),
  plan: z.array(planDaySchema).nullable().default(null),
  journal: z.array(journalEntrySchema).default([]),
  circle: z.array(circleEntrySchema).default([]),
  preferences: prefsSchema.partial().default({}),
});

export const importFileSchema = z.object({
  format: z.literal(EXPORT_FORMAT),
  version: z.number().int().min(1).max(EXPORT_VERSION),
  exportedAt: z.string(),
  appVersion: z.string().default(""),
  data: exportDataSchema,
});

export type ValidImport = z.infer<typeof importFileSchema>;
export type ExportBundle = ValidImport;

export interface ImportPreview {
  version: number;
  exportedAt: string;
  counts: { assessment: number; flow: number; plan: number; journal: number; circle: number; hasResults: boolean; hasPreferences: boolean };
}

function tryParseStored<T>(key: string, fallback: T): T {
  const raw = getRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Read every namespaced key and wrap it in the versioned envelope. Browser only. */
export function collectExport(): ExportBundle {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    data: {
      assessment: tryParseStored(STORAGE_KEYS.answers, {}),
      results: tryParseStored(STORAGE_KEYS.result, null),
      flow: tryParseStored(STORAGE_KEYS.flow, []),
      plan: tryParseStored(STORAGE_KEYS.plan, null),
      journal: tryParseStored(STORAGE_KEYS.journal, []),
      circle: tryParseStored(STORAGE_KEYS.circle, []),
      preferences: tryParseStored(STORAGE_KEYS.prefs, {}),
    },
  };
}

/** Pure: byte-size gate + JSON parse + Zod validation. Never throws. */
export function parseImportFile(raw: string): { ok: true; value: ValidImport } | { ok: false; error: string } {
  if (typeof raw !== "string" || raw.length === 0) return { ok: false, error: "The file is empty." };
  if (raw.length > MAX_IMPORT_BYTES) return { ok: false, error: `The file is too large (limit ${(MAX_IMPORT_BYTES / 1024 / 1024).toFixed(0)} MB).` };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "This file is not valid JSON. Only Ikigai export files (.json) are accepted." };
  }
  const res = importFileSchema.safeParse(parsed);
  if (!res.success) {
    const first = res.error.issues[0];
    const where = first.path.join(".") || "file";
    if (where === "format" || where === "version") {
      return { ok: false, error: "This is not a supported Ikigai export file (wrong format or version)." };
    }
    return { ok: false, error: `This file could not be accepted (${where}: ${first.message}). Your current data is unchanged.` };
  }
  return { ok: true, value: res.data };
}

export function previewOf(value: ValidImport): ImportPreview {
  const d = value.data;
  return {
    version: value.version,
    exportedAt: value.exportedAt,
    counts: {
      assessment: Object.keys(d.assessment ?? {}).length,
      flow: d.flow?.length ?? 0,
      plan: d.plan?.length ?? 0,
      journal: d.journal?.length ?? 0,
      circle: d.circle?.length ?? 0,
      hasResults: d.results !== null,
      hasPreferences: Object.keys(d.preferences ?? {}).length > 0,
    },
  };
}
