import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sampleData } from "@/lib/demo.js";
import { scoreAll } from "@/lib/scoring.js";
import { STORAGE_KEYS } from "@/lib/constants.js";

describe("demo sample bundle", () => {
  it("covers answers, result, flow, journal, and circle — never preferences", () => {
    const data = sampleData();
    for (const k of [STORAGE_KEYS.answers, STORAGE_KEYS.result, STORAGE_KEYS.flow, STORAGE_KEYS.journal, STORAGE_KEYS.circle]) {
      assert.ok(typeof data[k] === "string" && data[k].length > 2, k);
    }
    assert.equal(STORAGE_KEYS.prefs in data, false);
  });

  it("seeds a complete 40-answer assessment", () => {
    const answers = JSON.parse(sampleData()[STORAGE_KEYS.answers]) as Record<string, number>;
    assert.equal(Object.keys(answers).length, 40);
    for (const v of Object.values(answers)) {
      assert.ok(Number.isInteger(v) && v >= 1 && v <= 5);
    }
  });

  it("embeds a result consistent with its own answers", () => {
    const data = sampleData();
    const answers = JSON.parse(data[STORAGE_KEYS.answers]);
    const embedded = JSON.parse(data[STORAGE_KEYS.result]);
    const recomputed = JSON.parse(JSON.stringify(scoreAll(answers)));
    assert.equal(embedded.archetype, recomputed.archetype);
    assert.equal(embedded.overall, recomputed.overall);
    assert.equal(embedded.scores.length, 5);
  });

  it("labels every sample record as demo content", () => {
    const data = sampleData();
    const flow = JSON.parse(data[STORAGE_KEYS.flow]) as Array<{ activity: string }>;
    const journal = JSON.parse(data[STORAGE_KEYS.journal]) as Array<{ text: string }>;
    const circle = JSON.parse(data[STORAGE_KEYS.circle]) as Array<{ label: string }>;
    assert.ok(flow.length >= 2 && flow.every((e) => e.activity.startsWith("Demo:")));
    assert.ok(journal.length >= 1 && journal.every((e) => e.text.includes("Demo")));
    assert.ok(circle.length >= 1 && circle.every((e) => e.label.startsWith("Demo")));
  });
});
