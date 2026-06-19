import type { ProgressStats } from "./stats";
import type { BadgeDefinition, CategoryId } from "./types";

// Badges reinforce useful study behaviour without childishness (PRD §11.10).
// `icon` is a key into the SVG icon registry — no emoji.

export interface BadgeContext {
  stats: ProgressStats;
  practiceSessions: number;
  reviewCorrections: number;
  streakCount: number;
  readinessScore: number;
}

interface Badge extends BadgeDefinition {
  check: (ctx: BadgeContext) => boolean;
}

const categoryScore = (stats: ProgressStats, id: CategoryId) =>
  stats.categoryStats.find((c) => c.categoryId === id)?.score ?? 0;

/** Consecutive passes counting back from the most recent mock exam. */
const mockPassStreak = (stats: ProgressStats): number => {
  let streak = 0;
  for (const attempt of stats.mockAttempts) {
    if (attempt.passed) streak += 1;
    else break;
  }
  return streak;
};

export const badges: Badge[] = [
  {
    id: "first-session",
    name: "First Steps",
    description: "Complete your first practice session.",
    icon: "sprout",
    check: (c) => c.practiceSessions >= 1,
  },
  {
    id: "first-mock",
    name: "Dress Rehearsal",
    description: "Sit your first mock exam.",
    icon: "timer",
    check: (c) => c.stats.mockAttempts.length >= 1,
  },
  {
    id: "first-pass",
    name: "First Pass",
    description: "Pass a mock exam for the first time.",
    icon: "badge-check",
    check: (c) => c.stats.mockAttempts.some((a) => a.passed),
  },
  {
    id: "hat-trick",
    name: "Hat-Trick",
    description: "Pass three mock exams in a row.",
    icon: "target",
    check: (c) => mockPassStreak(c.stats) >= 3,
  },
  {
    id: "top-marks",
    name: "Top Marks",
    description: "Score 24 out of 24 in a mock exam.",
    icon: "trophy",
    check: (c) => (c.stats.bestMockScore ?? 0) >= 24,
  },
  {
    id: "history-foundations",
    name: "History Foundations",
    description: "Reach 70% mastery in UK History.",
    icon: "castle",
    check: (c) => categoryScore(c.stats, "history") >= 70,
  },
  {
    id: "government-ready",
    name: "Government Ready",
    description: "Reach 70% mastery in Government & Democracy.",
    icon: "landmark",
    check: (c) => categoryScore(c.stats, "government") >= 70,
  },
  {
    id: "culture-collector",
    name: "Culture Collector",
    description: "Reach 70% mastery in Culture & Traditions.",
    icon: "drama",
    check: (c) => categoryScore(c.stats, "culture-traditions") >= 70,
  },
  {
    id: "error-crusher",
    name: "Error Crusher",
    description: "Put right 10 facts you previously got wrong.",
    icon: "wrench",
    check: (c) => c.reviewCorrections >= 10,
  },
  {
    id: "week-streak",
    name: "Seven-Day Streak",
    description: "Practise on seven days in a row.",
    icon: "flame",
    check: (c) => c.streakCount >= 7,
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Answer 100 questions in total.",
    icon: "award",
    check: (c) => c.stats.totalAnswered >= 100,
  },
  {
    id: "likely-ready",
    name: "Likely Ready",
    description: "Reach a readiness score of 80 or more.",
    icon: "shield-check",
    check: (c) => c.readinessScore >= 80,
  },
];

export const badgeById = new Map(badges.map((b) => [b.id, b]));

/** Returns the ids of every badge whose condition is currently met. */
export const evaluateBadges = (ctx: BadgeContext): string[] =>
  badges.filter((b) => b.check(ctx)).map((b) => b.id);
