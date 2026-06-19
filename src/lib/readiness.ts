import { isStreakAlive } from "./gamification";
import type { ProgressStats } from "./stats";
import type { Readiness, ReadinessLabel } from "./types";

// Composite readiness signal (PRD §16). This is *guidance*, never a guarantee:
// the UI always pairs it with a "buffer above the pass mark" message.
//
//   readiness = mockAverage   * 0.45
//             + categoryCover  * 0.25
//             + weakFactScore  * 0.20
//             + consistency    * 0.10

export const labelForScore = (score: number): ReadinessLabel => {
  if (score >= 80) return "Likely ready";
  if (score >= 65) return "Almost ready";
  if (score >= 40) return "Building foundations";
  return "Not ready yet";
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export interface ReadinessInput {
  stats: ProgressStats;
  streakCount: number;
  lastPracticeDay?: string;
  today: string;
}

export const computeReadiness = ({
  stats,
  streakCount,
  lastPracticeDay,
  today,
}: ReadinessInput): Readiness => {
  const mockAverage = stats.recentMockAvgPercent;
  const categoryCover = stats.overallMastery;
  const weakFactScore = clamp(100 - stats.highImportanceGaps * 8);

  const streakComponent = isStreakAlive(lastPracticeDay, today)
    ? Math.min(60, streakCount * 12)
    : 0;
  const volumeComponent = Math.min(40, stats.totalAnswered * 2);
  const consistency = clamp(streakComponent + volumeComponent);

  const score = Math.round(
    mockAverage * 0.45 + categoryCover * 0.25 + weakFactScore * 0.2 + consistency * 0.1,
  );

  const reasons = buildReasons(stats, consistency);
  return { score: clamp(score), label: labelForScore(clamp(score)), reasons };
};

const buildReasons = (stats: ProgressStats, consistency: number): string[] => {
  const reasons: string[] = [];

  if (stats.mockAttempts.length === 0) {
    reasons.push("Take a mock exam to unlock your readiness signal.");
  } else {
    const best = stats.bestMockScore ?? 0;
    reasons.push(
      `Your recent mock average is ${stats.recentMockAvgPercent}% (best ${best}/24). Aim to stay above 21/24.`,
    );
  }

  if (stats.highImportanceGaps > 0) {
    reasons.push(
      `${stats.highImportanceGaps} key fact${stats.highImportanceGaps === 1 ? "" : "s"} still need work.`,
    );
  } else if (stats.totalAnswered > 0) {
    reasons.push("No major weak facts remain — keep them fresh.");
  }

  const weakestCategory = [...stats.categoryStats].sort((a, b) => a.score - b.score)[0];
  if (weakestCategory && weakestCategory.score < 60) {
    reasons.push(`Weakest area: ${weakestCategory.title} (${weakestCategory.score}%).`);
  }

  if (consistency < 30) {
    reasons.push("Practise a little every day to build a steady streak.");
  }

  return reasons;
};
