import type { UserMastery } from "./types";

const DAY = 24 * 60 * 60 * 1000;

// Spaced-repetition intervals indexed by consecutive correct answers.
// More correct answers in a row → the fact is resurfaced further into the future.
const REVIEW_INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];

const clamp = (n: number) => Math.max(0, Math.min(100, n));

const intervalFor = (consecutiveCorrect: number) =>
  REVIEW_INTERVALS[Math.min(consecutiveCorrect, REVIEW_INTERVALS.length - 1)];

const emptyMastery = (knowledgeItemId: string): UserMastery => ({
  knowledgeItemId,
  masteryScore: 0,
  consecutiveCorrect: 0,
  consecutiveIncorrect: 0,
  seen: 0,
});

export const updateMastery = (
  knowledgeItemId: string,
  current: UserMastery | undefined,
  isCorrect: boolean,
  now: number,
): UserMastery => {
  const base = current ?? emptyMastery(knowledgeItemId);
  const consecutiveCorrect = isCorrect ? base.consecutiveCorrect + 1 : 0;
  const consecutiveIncorrect = isCorrect ? 0 : base.consecutiveIncorrect + 1;
  const masteryScore = clamp(base.masteryScore + (isCorrect ? 20 : -25));

  return {
    knowledgeItemId,
    masteryScore,
    consecutiveCorrect,
    consecutiveIncorrect,
    seen: base.seen + 1,
    lastReviewedAt: now,
    nextReviewAt: now + intervalFor(consecutiveCorrect),
  };
};

export const isOverdue = (mastery: UserMastery, now: number) =>
  mastery.nextReviewAt !== undefined && mastery.nextReviewAt <= now;

/** A fact counts as "weak" until it has been answered correctly a few times. */
export const isWeak = (mastery: UserMastery | undefined) =>
  !mastery || mastery.masteryScore < 60 || mastery.consecutiveCorrect < 2;
