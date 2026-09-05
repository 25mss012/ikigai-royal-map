// Safe browser storage with in-memory fallback (private mode / disabled localStorage).
const memory = new Map<string, string>();
let warned = false;

function backend(): Storage | null {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return null;
    const k = "__ikigai_probe__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    if (!warned) { warned = true; }
    return null;
  }
}

export function storageAvailable(): boolean {
  return backend() !== null;
}

export function getRaw(key: string): string | null {
  const b = backend();
  try {
    if (b) return b.getItem(key);
  } catch { /* fall through */ }
  return memory.has(key) ? memory.get(key)! : null;
}

export function setRaw(key: string, value: string): void {
  const b = backend();
  try {
    if (b) { b.setItem(key, value); return; }
  } catch { /* fallback */ }
  try { memory.set(key, value); } catch { /* ignore */ }
}

export function removeKey(key: string): void {
  const b = backend();
  try { if (b) b.removeItem(key); } catch { /* ignore */ }
  memory.delete(key);
}

export function getJSON<T>(key: string, fallback: T): T {
  const raw = getRaw(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function setJSON(key: string, value: unknown): void {
  try { setRaw(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function clearAllIkigai(): void {
  const prefixes = ["ikigai.v1."];
  const b = backend();
  try {
    if (b) {
      const toRemove: string[] = [];
      for (let i = 0; i < b.length; i++) {
        const k = b.key(i);
        if (k && prefixes.some((p) => k.startsWith(p))) toRemove.push(k);
      }
      toRemove.forEach((k) => b.removeItem(k));
    }
  } catch { /* ignore */ }
  for (const k of Array.from(memory.keys())) {
    if (prefixes.some((p) => k.startsWith(p))) memory.delete(k);
  }
}

export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), app: "ikigai-royal-map", version: 1 };
  const keys = ["ikigai.v1.assessment-answers", "ikigai.v1.assessment-result", "ikigai.v1.flow-entries", "ikigai.v1.journal-entries", "ikigai.v1.plan-state", "ikigai.v1.circle-entries", "ikigai.v1.prefs"];
  for (const k of keys) {
    const raw = getRaw(k);
    out[k] = raw ? tryParse(raw) : null;
  }
  return out;
}

function tryParse(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return raw; }
}
