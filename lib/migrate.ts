import { STORAGE_KEYS } from "@/lib/constants";

/** Current schema generation. Bump when a stored shape changes. */
export const STORAGE_VERSION = 1 as const;
export const META_KEY = "ikigai.v1.meta" as const;
const BACKUP_PREFIX = "ikigai.v1.backup." as const;

/** Minimal key/value surface so migration is unit-testable without a browser. */
export interface KVStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export function browserStore(): KVStore | null {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return null;
    window.localStorage.setItem("__ikigai_probe__", "1");
    window.localStorage.removeItem("__ikigai_probe__");
    const ls = window.localStorage;
    return {
      get: (k) => { try { return ls.getItem(k); } catch { return null; } },
      set: (k, v) => { try { ls.setItem(k, v); } catch { /* full/blocked: keep going */ } },
      remove: (k) => { try { ls.removeItem(k); } catch { /* ignore */ } },
    };
  } catch {
    return null;
  }
}

function readJSON(store: KVStore, key: string): unknown {
  const raw = store.get(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return { __corrupt: true };
  }
}

function isCorrupt(v: unknown): boolean {
  return v !== null && typeof v === "object" && !Array.isArray(v) && (v as Record<string, unknown>).__corrupt === true;
}

/** Pure per-record sanitizers. Each returns a safe value; never throws. */
export function sanitizeAnswers(v: unknown): Record<string, 1 | 2 | 3 | 4 | 5 | null> {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return {};
  const out: Record<string, 1 | 2 | 3 | 4 | 5 | null> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (val === null) out[k] = null;
    else if (typeof val === "number" && Number.isInteger(val) && val >= 1 && val <= 5) {
      out[k] = val as 1 | 2 | 3 | 4 | 5;
    }
  }
  return out;
}

export function sanitizeList<T>(v: unknown, keep: (item: unknown) => item is T): T[] {
  if (!Array.isArray(v)) return [];
  return v.filter(keep);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function sanitizePrefs(v: unknown, defaults: Record<string, unknown>): Record<string, unknown> {
  if (!isObject(v)) return { ...defaults };
  const out: Record<string, unknown> = { ...defaults };
  for (const k of Object.keys(defaults)) {
    if (k in v) {
      const val = (v as Record<string, unknown>)[k];
      if (typeof val === typeof defaults[k] || defaults[k] === null) out[k] = val as unknown;
    }
  }
  return out;
}

export interface MigrationReport {
  fromVersion: number;
  toVersion: number;
  migrated: boolean;
  resetKeys: string[];
  backupKey: string | null;
  notes: string[];
}

/**
 * Bring every namespaced key to STORAGE_VERSION.
 * - Missing keys: left alone (empty states handle them).
 * - Corrupt or wrong-shape records: reset individually, others preserved.
 * - A backup snapshot is written only when something actually changed.
 */
export function migrateStore(store: KVStore): MigrationReport {
  const report: MigrationReport = { fromVersion: 0, toVersion: STORAGE_VERSION, migrated: false, resetKeys: [], backupKey: null, notes: [] };
  const metaRaw = store.get(META_KEY);
  let from = 0;
  if (metaRaw) {
    try {
      const meta = JSON.parse(metaRaw) as { version?: unknown };
      if (typeof meta.version === "number") from = meta.version;
    } catch { /* treat as v0 */ }
  }
  report.fromVersion = from;

  const listKeys = [STORAGE_KEYS.flow, STORAGE_KEYS.journal, STORAGE_KEYS.circle];
  const recordKeys = [STORAGE_KEYS.answers, STORAGE_KEYS.prefs];
  const changed: Array<{ key: string; before: string | null }> = [];

  if (from < 1) {
    for (const key of listKeys) {
      const v = readJSON(store, key);
      if (v !== undefined && !Array.isArray(v)) {
        changed.push({ key, before: store.get(key) });
        store.set(key, "[]");
        report.resetKeys.push(key);
        report.notes.push(`${key} was not a list and was reset to empty.`);
      } else if (isCorrupt(v)) {
        changed.push({ key, before: store.get(key) });
        store.set(key, "[]");
        report.resetKeys.push(key);
        report.notes.push(`${key} was unreadable and was reset to empty.`);
      }
    }
    for (const key of recordKeys) {
      const v = readJSON(store, key);
      if (v !== undefined && (Array.isArray(v) || typeof v !== "object" || v === null || isCorrupt(v))) {
        changed.push({ key, before: store.get(key) });
        store.set(key, "{}");
        report.resetKeys.push(key);
        report.notes.push(`${key} was unreadable and was reset to empty.`);
      }
    }
    const plan = readJSON(store, STORAGE_KEYS.plan);
    if (plan !== undefined && plan !== null && !Array.isArray(plan)) {
      changed.push({ key: STORAGE_KEYS.plan, before: store.get(STORAGE_KEYS.plan) });
      store.remove(STORAGE_KEYS.plan);
      report.resetKeys.push(STORAGE_KEYS.plan);
      report.notes.push(`${STORAGE_KEYS.plan} was unreadable and was cleared.`);
    }
    const result = readJSON(store, STORAGE_KEYS.result);
    if (result !== undefined && result !== null && (!isObject(result) || !Array.isArray((result as Record<string, unknown>).scores))) {
      changed.push({ key: STORAGE_KEYS.result, before: store.get(STORAGE_KEYS.result) });
      store.remove(STORAGE_KEYS.result);
      report.resetKeys.push(STORAGE_KEYS.result);
      report.notes.push(`${STORAGE_KEYS.result} was unreadable and was cleared.`);
    }
  }

  if (changed.length > 0) {
    const backupKey = `${BACKUP_PREFIX}${Date.now()}`;
    try {
      const snap: Record<string, unknown> = {};
      for (const c of changed) snap[c.key] = c.before;
      store.set(backupKey, JSON.stringify({ at: new Date().toISOString(), fromVersion: from, records: snap }));
      report.backupKey = backupKey;
    } catch { /* backup best-effort */ }
    report.migrated = true;
  }
  try {
    store.set(META_KEY, JSON.stringify({ version: STORAGE_VERSION, updatedAt: new Date().toISOString() }));
  } catch { /* ignore */ }
  return report;
}

/** Browser entry point. Safe to call on every app start; returns null when storage is unavailable. */
export function migrateLocalStorage(): MigrationReport | null {
  const store = browserStore();
  if (!store) return null;
  try {
    return migrateStore(store);
  } catch {
    return null;
  }
}
