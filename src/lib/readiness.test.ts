import { describe, expect, it } from "vitest";
import { computeReadiness, labelForScore } from "./readiness";
import type { ProgressStats } from "./stats";

const makeStats = (overrides: Partial<ProgressStats> = {}): ProgressStats => ({
  categoryStats: [],
  weakItems: [],
  overallMastery: 0,
  totalAnswered: 0,
  correctAnswered: 0,
  accuracy: 0,
  mockAttempts: [],
  bestMockScore: null,
  recentMockAvgPercent: 0,
  highImportanceGaps: 0,
  ...overrides,
});

describe("labelForScore", () => {
  it("maps scores to the four readiness bands", () => {
    expect(labelForScore(80)).toBe("Likely ready");
    expect(labelForScore(65)).toBe("Almost ready");
    expect(labelForScore(40)).toBe("Building foundations");
    expect(labelForScore(0)).toBe("Not ready yet");
  });
});

describe("computeReadiness", () => {
  it("scores a brand-new user as not ready and prompts a mock exam", () => {
    const r = computeReadiness({
      stats: makeStats(),
      streakCount: 0,
      today: "2026-06-20",
    });
    expect(r.score).toBeLessThan(40);
    expect(r.label).toBe("Not ready yet");
    expect(r.reasons[0]).toMatch(/mock exam/i);
  });

  it("scores a well-prepared user as likely ready", () => {
    const r = computeReadiness({
      stats: makeStats({
        recentMockAvgPercent: 90,
        overallMastery: 90,
        highImportanceGaps: 0,
        totalAnswered: 100,
        mockAttempts: [{} as never],
        bestMockScore: 23,
      }),
      streakCount: 5,
      lastPracticeDay: "2026-06-20",
      today: "2026-06-20",
    });
    expect(r.score).toBeGreaterThanOrEqual(80);
    expect(r.label).toBe("Likely ready");
  });

  it("always keeps the score within 0–100", () => {
    const r = computeReadiness({
      stats: makeStats({
        recentMockAvgPercent: 100,
        overallMastery: 100,
        totalAnswered: 9999,
      }),
      streakCount: 9999,
      lastPracticeDay: "2026-06-20",
      today: "2026-06-20",
    });
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });

  it("surfaces weak facts and the weakest category as reasons", () => {
    const r = computeReadiness({
      stats: makeStats({
        highImportanceGaps: 2,
        totalAnswered: 10,
        mockAttempts: [{} as never],
        categoryStats: [
          {
            categoryId: "x" as never,
            title: "Tudors",
            icon: "",
            score: 30,
            seen: 1,
            total: 5,
          },
        ],
      }),
      streakCount: 0,
      today: "2026-06-20",
    });
    expect(r.reasons.some((reason) => reason.includes("2 key facts"))).toBe(true);
    expect(r.reasons.some((reason) => reason.includes("Tudors"))).toBe(true);
  });
});
