import { describe, expect, it } from "vitest";
import { isOverdue, isWeak, updateMastery } from "./mastery";
import type { UserMastery } from "./types";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

describe("updateMastery", () => {
  it("seeds a new fact on a first correct answer", () => {
    const m = updateMastery("ki-1", undefined, true, NOW);
    expect(m).toMatchObject({
      knowledgeItemId: "ki-1",
      masteryScore: 20,
      consecutiveCorrect: 1,
      consecutiveIncorrect: 0,
      seen: 1,
      lastReviewedAt: NOW,
    });
    // One correct → resurfaced one day out.
    expect(m.nextReviewAt).toBe(NOW + DAY);
  });

  it("makes a wrong answer immediately reviewable and clamps score at 0", () => {
    const m = updateMastery("ki-1", undefined, false, NOW);
    expect(m.masteryScore).toBe(0);
    expect(m.consecutiveIncorrect).toBe(1);
    expect(m.consecutiveCorrect).toBe(0);
    expect(m.nextReviewAt).toBe(NOW);
  });

  it("caps the mastery score at 100 over a long correct streak", () => {
    let m: UserMastery | undefined;
    for (let i = 0; i < 10; i += 1) m = updateMastery("ki-1", m, true, NOW);
    expect(m!.masteryScore).toBe(100);
    expect(m!.consecutiveCorrect).toBe(10);
  });

  it("resets the correct streak on a wrong answer", () => {
    const correct = updateMastery("ki-1", undefined, true, NOW);
    const wrong = updateMastery("ki-1", correct, false, NOW);
    expect(wrong.consecutiveCorrect).toBe(0);
    expect(wrong.masteryScore).toBe(0); // clamp(20 - 25)
  });
});

describe("isOverdue", () => {
  it("is true when nextReviewAt is at or before now", () => {
    expect(isOverdue({ nextReviewAt: NOW } as UserMastery, NOW)).toBe(true);
    expect(isOverdue({ nextReviewAt: NOW - 1 } as UserMastery, NOW)).toBe(true);
  });

  it("is false when the review is in the future or unset", () => {
    expect(isOverdue({ nextReviewAt: NOW + 1 } as UserMastery, NOW)).toBe(false);
    expect(isOverdue({} as UserMastery, NOW)).toBe(false);
  });
});

describe("isWeak", () => {
  it("treats an unseen fact as weak", () => {
    expect(isWeak(undefined)).toBe(true);
  });

  it("is weak until both score and correct-streak thresholds are met", () => {
    expect(isWeak({ masteryScore: 80, consecutiveCorrect: 1 } as UserMastery)).toBe(true);
    expect(isWeak({ masteryScore: 40, consecutiveCorrect: 5 } as UserMastery)).toBe(true);
  });

  it("is strong once mastered", () => {
    expect(isWeak({ masteryScore: 80, consecutiveCorrect: 2 } as UserMastery)).toBe(false);
  });
});
