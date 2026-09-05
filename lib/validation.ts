import { z } from "zod";

export const flowSchema = z.object({
  activity: z.string().min(2, "Give the activity a short name.").max(80),
  date: z.string().min(1, "Choose a date."),
  timeOfDay: z.string().default(""),
  durationMin: z.coerce.number().min(1).max(1440),
  focus: z.coerce.number().min(1).max(5),
  enjoyment: z.coerce.number().min(1).max(5),
  difficulty: z.coerce.number().min(1).max(5),
  confidence: z.coerce.number().min(1).max(5),
  setting: z.enum(["alone", "with-others", "online", "outdoors", "mixed"]),
  notes: z.string().max(2000).default(""),
});

export const journalSchema = z.object({
  date: z.string().min(1),
  mood: z.coerce.number().min(1).max(5),
  energy: z.coerce.number().min(1).max(5),
  purpose: z.coerce.number().min(1).max(5),
  text: z.string().min(1, "Write at least a sentence.").max(10000),
  tags: z.string().default(""),
  activity: z.string().max(120).default(""),
  gratitude: z.string().max(2000).default(""),
  challenge: z.string().max(2000).default(""),
});

export const circleSchema = z.object({
  label: z.string().min(1, "Add a name or label.").max(60),
  kind: z.string().min(1).max(60),
  supportReceived: z.string().max(500).default(""),
  supportGiven: z.string().max(500).default(""),
  lastConnection: z.string().default(""),
  nextIntention: z.string().max(500).default(""),
});

export type FlowInput = z.infer<typeof flowSchema>;
export type JournalInput = z.infer<typeof journalSchema>;
export type CircleInput = z.infer<typeof circleSchema>;
