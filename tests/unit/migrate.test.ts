import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  META_KEY,
  STORAGE_VERSION,
  migrateStore,
  sanitizeAnswers,
  sanitizeList,
  sanitizePrefs,
  type KVStore,
} from "@/lib/migrate.js";
import { STORAGE_KEYS } from "@/lib/constants.js";

function memoryStore(seed: Record<string, string> = {}): KVStore {
  const m = new Map(Object.entries(seed));
  return {
    get: (k) => (m.has(k) ? m.get(k)! : null),
    set: (k, v) => { m.set(k, v); },
    remove: (k) => { m.delete(k); },
  };
}

describe("migrateStore", () => {
  it("stamps the current version on empty storage without touching data", () => {
    const s = memoryStore();
    const r = migrateStore(s);
    assert.equal(r.fromVersion, 0);
    assert.equal(r.toVersion, STORAGE_VERSION);
    assert.equal(r.migrated, false);
    assert.deepEqual(r.resetKeys, []);
    assert.equal(JSON.parse(s.get(META_KEY)!).version, STORAGE_VERSION);
  });

  it("leaves valid current-shape data alone", () => {
    const s = memoryStore({
      [STORAGE_KEYS.flow]: JSON.stringify([{ id: "f1" }]),
      [STORAGE_KEYS.answers]: JSON.stringify({ love1: 4 }),
    });
    const r = migrateStore(s);
    assert.equal(r.migrated, false);
    assert.equal(s.get(STORAGE_KEYS.flow), JSON.stringify([{ id: "f1" }]));
    assert.equal(s.get(STORAGE_KEYS.answers), JSON.stringify({ love1: 4 }));
  });

  it("resets only the corrupted key and backs it up", () => {
    const good = JSON.stringify([{ id: "j1" }]);
    const s = memoryStore({
      [STORAGE_KEYS.journal]: good,
      [STORAGE_KEYS.flow]: "{not json",
      [STORAGE_KEYS.answers]: "[1,2,3]",
    });
    const r = migrateStore(s);
    assert.equal(r.migrated, true);
    assert.ok(r.backupKey);
    assert.equal(s.get(STORAGE_KEYS.journal), good);
    assert.equal(s.get(STORAGE_KEYS.flow), "[]");
    assert.equal(s.get(STORAGE_KEYS.answers), "{}");
    const backup = JSON.parse(s.get(r.backupKey!)!);
    assert.equal(backup.records[STORAGE_KEYS.flow], "{not json");
  });

  it("clears a malformed result while keeping everything else", () => {
    const s = memoryStore({
      [STORAGE_KEYS.result]: JSON.stringify({ nope: true }),
      [STORAGE_KEYS.circle]: JSON.stringify([{ id: "c1" }]),
    });
    const r = migrateStore(s);
    assert.equal(s.get(STORAGE_KEYS.result), null);
    assert.equal(s.get(STORAGE_KEYS.circle), JSON.stringify([{ id: "c1" }]));
    assert.ok(r.resetKeys.includes(STORAGE_KEYS.result));
  });

  it("accepts a null plan slot and a valid plan list", () => {
    const s = memoryStore({ [STORAGE_KEYS.plan]: "null" });
    const r = migrateStore(s);
    assert.equal(r.migrated, false);
  });
});

describe("sanitizeAnswers", () => {
  it("keeps 1-5 and null, drops everything else", () => {
    assert.deepEqual(
      sanitizeAnswers({ a: 3, b: 6, c: 0, d: "x", e: null, f: 2.5 }),
      { a: 3, e: null }
    );
  });
  it("returns {} for non-objects", () => {
    assert.deepEqual(sanitizeAnswers([1, 2]), {});
    assert.deepEqual(sanitizeAnswers("hi"), {});
    assert.deepEqual(sanitizeAnswers(null), {});
  });
});

describe("sanitizeList", () => {
  it("keeps matching items only", () => {
    const isTagged = (v: unknown): v is { tag: string } => {
      const o = v as Record<string, unknown>;
      return !!o && typeof o === "object" && typeof o.tag === "string";
    };
    assert.deepEqual(sanitizeList([{ tag: "a" }, { tag: 1 }, null], isTagged), [{ tag: "a" }]);
  });
  it("returns [] for non-arrays", () => {
    assert.deepEqual(sanitizeList({}, (v): v is never => true), []);
  });
});

describe("sanitizePrefs", () => {
  const defaults = { lang: "en", theme: "light", reducedMotion: false };
  it("merges known keys, ignores unknown and mistyped ones", () => {
    assert.deepEqual(
      sanitizePrefs({ lang: "ta", theme: 42, extra: 1 }, defaults),
      { lang: "ta", theme: "light", reducedMotion: false }
    );
  });
  it("returns defaults for non-objects", () => {
    assert.deepEqual(sanitizePrefs([1], defaults), defaults);
  });
});
