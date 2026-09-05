import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EXPORT_FORMAT,
  EXPORT_VERSION,
  MAX_IMPORT_BYTES,
  parseImportFile,
  previewOf,
  type ValidImport,
} from "@/lib/portability.js";

function validBundle(): Record<string, unknown> {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: "2026-09-06T00:00:00.000Z",
    appVersion: "1.2.0",
    data: {
      assessment: { love1: 4, love2: null },
      results: null,
      flow: [{ id: "f1", activity: "Test activity", date: "2026-09-01", durationMin: 20, focus: 4, enjoyment: 5, difficulty: 3, confidence: 3, setting: "alone", flowScore: 4.5 }],
      plan: null,
      journal: [{ id: "j1", date: "2026-09-01", mood: 4, energy: 3, purpose: 4, text: "Test reflection" }],
      circle: [{ id: "c1", label: "Test group", kind: "Group / Community" }],
      preferences: { lang: "en", theme: "light" },
    },
  };
}

describe("parseImportFile", () => {
  it("accepts a valid export", () => {
    const res = parseImportFile(JSON.stringify(validBundle()));
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.value.format, EXPORT_FORMAT);
      assert.equal(res.value.data.flow.length, 1);
    }
  });

  it("rejects empty and non-JSON input", () => {
    assert.equal(parseImportFile("").ok, false);
    assert.equal(parseImportFile("{oops").ok, false);
  });

  it("rejects wrong format and unsupported versions", () => {
    const wrong = { ...validBundle(), format: "other-app" };
    const r1 = parseImportFile(JSON.stringify(wrong));
    assert.equal(r1.ok, false);
    if (!r1.ok) assert.match(r1.error, /format or version/);
    const future = { ...validBundle(), version: EXPORT_VERSION + 99 };
    assert.equal(parseImportFile(JSON.stringify(future)).ok, false);
  });

  it("rejects bad section data without throwing", () => {
    const b = validBundle() as { data: Record<string, unknown> };
    b.data = { ...b.data, flow: [{ activity: "", date: "x", durationMin: 0, focus: 9, enjoyment: 9, difficulty: 9, confidence: 9, setting: "nowhere", text: "x" }] };
    const res = parseImportFile(JSON.stringify(b));
    assert.equal(res.ok, false);
    if (!res.ok) assert.match(res.error, /flow/);
  });

  it("rejects oversized files before parsing", () => {
    const big = " ".repeat(MAX_IMPORT_BYTES + 1);
    const res = parseImportFile(big);
    assert.equal(res.ok, false);
    if (!res.ok) assert.match(res.error, /too large/);
  });

  it("strips unknown extra fields instead of failing", () => {
    const b = validBundle() as { data: { journal: Array<Record<string, unknown>> } };
    b.data.journal[0].hacker = "ignored";
    const res = parseImportFile(JSON.stringify(b));
    assert.equal(res.ok, true);
  });
});

describe("previewOf", () => {
  it("summarizes counts without exposing private text", () => {
    const res = parseImportFile(JSON.stringify(validBundle()));
    assert.equal(res.ok, true);
    if (!res.ok) return;
    const p = previewOf(res.value as ValidImport);
    assert.deepEqual(p.counts, { assessment: 2, flow: 1, plan: 0, journal: 1, circle: 1, hasResults: false, hasPreferences: true });
    assert.equal(JSON.stringify(p).includes("Test reflection"), false);
  });
});
