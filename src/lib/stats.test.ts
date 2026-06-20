import { describe, expect, it } from "vitest";
import { categories } from "@/content/categories";
import { computeStats } from "./stats";
import type { Answer, Attempt } from "./types";

const mockAttempt = (overrides: Partial<Attempt>): Attempt =>
  ({
    id: "a",
    mode: "mock_exam",
    startedAt: 0,
    completedAt: 1,
    score: 0,
    totalQuestions: 24,
    ...overrides,
  }) as Attempt;

describe("computeStats", () => {
  it("returns a safe zero-state for a fresh user", () => {
    const stats = computeStats({}, [], []);
    expect(stats.totalAnswered).toBe(0);
    expect(stats.accuracy).toBe(0);
    expect(stats.recentMockAvgPercent).toBe(0);
    expect(stats.bestMockScore).toBeNull();
    expect(stats.overallMastery).toBe(0);
    expect(stats.categoryStats).toHaveLength(categories.length);
  });

  it("computes accuracy from the answer history", () => {
    const answers = [
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: true },
      { isCorrect: true },
    ] as Answer[];
    const stats = computeStats({}, [], answers);
    expect(stats.totalAnswered).toBe(4);
    expect(stats.correctAnswered).toBe(3);
    expect(stats.accuracy).toBe(75);
  });

  it("reports the best mock score across attempts", () => {
    const attempts = [
      mockAttempt({ id: "1", score: 18 }),
      mockAttempt({ id: "2", score: 22 }),
    ];
    expect(computeStats({}, attempts, []).bestMockScore).toBe(22);
  });

  // Regression: a zero-question mock attempt must not poison the readiness
  // average with NaN (score / totalQuestions = 0 / 0).
  it("never produces NaN from a zero-question mock attempt", () => {
    const attempts = [mockAttempt({ score: 0, totalQuestions: 0 })];
    const { recentMockAvgPercent } = computeStats({}, attempts, []);
    expect(Number.isFinite(recentMockAvgPercent)).toBe(true);
    expect(recentMockAvgPercent).toBe(0);
  });
});
