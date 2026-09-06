import { STORAGE_KEYS } from "@/lib/constants";
import { scoreAll } from "@/lib/scoring";
import { removeKey } from "@/lib/storage";
import type { AnswerValue } from "@/types";

/**
 * Safe demo mode for judges/recruiters/first-time visitors.
 * enterDemo(): snapshots ALL ikigai.v1.* keys (except backups/flag),
 * then loads clearly-labeled sample data through the normal keys.
 * exitDemo(): restores the snapshot byte-for-byte, removes demo traces.
 * Real user data is never merged with, and never lost to, demo data.
 */
const DEMO_FLAG = "ikigai.v1.demo";
const DEMO_BACKUP = "ikigai.v1.backup.demo";
const PREFIX = "ikigai.v1.";

function ls(): Storage | null {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isDemoActive(): boolean {
  try {
    return ls()?.getItem(DEMO_FLAG) === "1";
  } catch {
    return false;
  }
}

function notify() {
  try {
    window.dispatchEvent(new Event("ikigai:demo"));
  } catch { /* ignore */ }
}

function sampleAnswers(): Record<string, AnswerValue> {
  const values: Record<string, Array<1 | 2 | 3 | 4 | 5>> = {
    love: [5, 5, 4, 5, 4, 5, 4, 5],
    str: [4, 4, 3, 4, 4, 3, 4, 4],
    con: [3, 4, 3, 3, 4, 3, 4, 3],
    val: [4, 5, 4, 4, 5, 4, 4, 5],
    flo: [2, 3, 2, 3, 2, 3, 2, 4],
  };
  const out: Record<string, AnswerValue> = {};
  for (const [prefix, arr] of Object.entries(values)) {
    arr.forEach((v, i) => { out[`${prefix}${i + 1}`] = v; });
  }
  return out;
}

/** Pure sample bundle (exported for unit tests). Never includes preferences. */
export function sampleData(): Record<string, string> {
  const now = new Date().toISOString();
  const day = now.slice(0, 10);
  const answers = sampleAnswers();
  const result = scoreAll(answers);
  return {
    [STORAGE_KEYS.answers]: JSON.stringify(answers),
    [STORAGE_KEYS.result]: JSON.stringify(result),
    [STORAGE_KEYS.flow]: JSON.stringify([
      { id: "demo-f1", activity: "Demo: morning sketch", date: day, timeOfDay: "morning", durationMin: 25, focus: 5, enjoyment: 5, difficulty: 3, confidence: 3, setting: "alone", notes: "Demo entry — time softened.", flowScore: 5 },
      { id: "demo-f2", activity: "Demo: helping a neighbour", date: day, timeOfDay: "evening", durationMin: 20, focus: 4, enjoyment: 4, difficulty: 2, confidence: 4, setting: "with-others", notes: "Demo entry — felt useful.", flowScore: 4 },
      { id: "demo-f3", activity: "Demo: noisy admin chores", date: day, timeOfDay: "afternoon", durationMin: 30, focus: 2, enjoyment: 2, difficulty: 4, confidence: 2, setting: "online", notes: "Demo entry — high friction.", flowScore: 2.3 },
    ]),
    [STORAGE_KEYS.journal]: JSON.stringify([
      { id: "demo-j1", date: day, mood: 4, energy: 4, purpose: 4, text: "Demo reflection — sketching before breakfast gave the day a direction.", tags: ["demo", "calm"], activity: "sketching", gratitude: "quiet kitchen", challenge: "waking earlier", createdAt: now, updatedAt: now },
      { id: "demo-j2", date: day, mood: 3, energy: 3, purpose: 4, text: "Demo reflection — helping carried more meaning than the chores that drained me.", tags: ["demo"], activity: "", gratitude: "", challenge: "", createdAt: now, updatedAt: now },
    ]),
    [STORAGE_KEYS.circle]: JSON.stringify([
      { id: "demo-c1", label: "Demo Mentor", kind: "Mentor / Teacher", supportReceived: "Demo: steady advice", supportGiven: "Demo: monthly update", lastConnection: day, nextIntention: "Demo: say thanks" },
      { id: "demo-c2", label: "Demo Walking Group", kind: "Group / Community", supportReceived: "Demo: company", supportGiven: "Demo: show up", lastConnection: day, nextIntention: "Demo: join Saturday" },
      { id: "demo-c3", label: "Demo Sea Air", kind: "Nature", supportReceived: "Demo: calm", supportGiven: "Demo: pick up litter", lastConnection: day, nextIntention: "Demo: evening walk" },
    ]),
  };
}

/** Snapshot real data, load samples. Returns false if storage is unavailable. */
export function enterDemo(): boolean {
  const store = ls();
  if (!store) return false;
  try {
    if (store.getItem(DEMO_FLAG) === "1") return true;
    const snapshot: Record<string, string | null> = {};
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k && k.startsWith(PREFIX) && k !== DEMO_BACKUP && k !== DEMO_FLAG) {
        snapshot[k] = store.getItem(k);
      }
    }
    store.setItem(DEMO_BACKUP, JSON.stringify({ at: new Date().toISOString(), records: snapshot }));
    const data = sampleData();
    for (const [k, v] of Object.entries(data)) store.setItem(k, v);
    store.removeItem(STORAGE_KEYS.plan);
    store.setItem(DEMO_FLAG, "1");
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Restore the pre-demo snapshot byte-for-byte. Returns false if nothing to restore. */
export function exitDemo(): boolean {
  const store = ls();
  if (!store) return false;
  try {
    if (store.getItem(DEMO_FLAG) !== "1") return false;
    let snapshot: Record<string, string | null> = {};
    try {
      snapshot = (JSON.parse(store.getItem(DEMO_BACKUP) ?? "{}") as { records?: Record<string, string | null> }).records ?? {};
    } catch { snapshot = {}; }
    const data = sampleData();
    for (const k of Object.keys(data)) store.removeItem(k);
    store.removeItem(STORAGE_KEYS.plan);
    for (const [k, v] of Object.entries(snapshot)) {
      if (v === null) store.removeItem(k);
      else store.setItem(k, v);
    }
    store.removeItem(DEMO_BACKUP);
    store.removeItem(DEMO_FLAG);
    // Belt-and-braces: never leave in-memory fallbacks behind either.
    removeKey(DEMO_BACKUP);
    removeKey(DEMO_FLAG);
    notify();
    return true;
  } catch {
    return false;
  }
}
