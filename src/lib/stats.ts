import { categories } from "@/content/categories";
import { knowledgeItemById, knowledgeItems } from "@/content/knowledge-items";
import { questionById } from "@/content/questions";
import { isWeak } from "./mastery";
import type { Answer, Attempt, CategoryId, KnowledgeItem, UserMastery } from "./types";

export interface CategoryStat {
  categoryId: CategoryId;
  title: string;
  icon: string;
  /** 0–100, with unseen facts counted as 0 so coverage is baked in. */
  score: number;
  seen: number;
  total: number;
}

export interface ProgressStats {
  categoryStats: CategoryStat[];
  weakItems: KnowledgeItem[];
  overallMastery: number;
  totalAnswered: number;
  correctAnswered: number;
  accuracy: number;
  mockAttempts: Attempt[];
  bestMockScore: number | null;
  recentMockAvgPercent: number;
  highImportanceGaps: number;
}

const importanceRank: Record<KnowledgeItem["importance"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const computeStats = (
  mastery: Record<string, UserMastery>,
  attempts: Attempt[],
  answers: Answer[],
): ProgressStats => {
  const categoryStats: CategoryStat[] = categories.map((category) => {
    const items = knowledgeItems.filter((k) => k.categoryId === category.id);
    const seen = items.filter((k) => mastery[k.id]?.seen).length;
    const masterySum = items.reduce(
      (sum, k) => sum + (mastery[k.id]?.masteryScore ?? 0),
      0,
    );
    return {
      categoryId: category.id,
      title: category.title,
      icon: category.icon,
      score: items.length ? Math.round(masterySum / items.length) : 0,
      seen,
      total: items.length,
    };
  });

  const weakItems = knowledgeItems
    .filter((k) => mastery[k.id]?.seen && isWeak(mastery[k.id]))
    .sort((a, b) => importanceRank[a.importance] - importanceRank[b.importance]);

  const highImportanceGaps = knowledgeItems.filter(
    (k) => k.importance === "high" && isWeak(mastery[k.id]),
  ).length;

  const overallMastery = Math.round(
    categoryStats.reduce((sum, c) => sum + c.score, 0) / categoryStats.length,
  );

  const correctAnswered = answers.filter((a) => a.isCorrect).length;
  const totalAnswered = answers.length;

  const mockAttempts = attempts
    .filter((a) => a.mode === "mock_exam" && a.completedAt)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  const bestMockScore = mockAttempts.length
    ? Math.max(...mockAttempts.map((a) => a.score))
    : null;

  const recentMocks = mockAttempts.slice(0, 3);
  const recentMockAvgPercent = recentMocks.length
    ? Math.round(
        (recentMocks.reduce((sum, a) => sum + a.score / a.totalQuestions, 0) /
          recentMocks.length) *
          100,
      )
    : 0;

  return {
    categoryStats,
    weakItems,
    overallMastery,
    totalAnswered,
    correctAnswered,
    accuracy: totalAnswered ? Math.round((correctAnswered / totalAnswered) * 100) : 0,
    mockAttempts,
    bestMockScore,
    recentMockAvgPercent,
    highImportanceGaps,
  };
};

export interface MistakeStat {
  item: KnowledgeItem;
  wrongCount: number;
  attempts: number;
}

/** The facts you get wrong most often, derived from your full answer history. */
export const commonMistakes = (answers: Answer[], limit = 8): MistakeStat[] => {
  const wrong = new Map<string, number>();
  const total = new Map<string, number>();

  for (const answer of answers) {
    const question = questionById.get(answer.questionId);
    if (!question) continue;
    for (const kiId of question.knowledgeItemIds) {
      total.set(kiId, (total.get(kiId) ?? 0) + 1);
      if (!answer.isCorrect) wrong.set(kiId, (wrong.get(kiId) ?? 0) + 1);
    }
  }

  return [...wrong.entries()]
    .map(([kiId, wrongCount]) => ({
      item: knowledgeItemById.get(kiId)!,
      wrongCount,
      attempts: total.get(kiId) ?? wrongCount,
    }))
    .filter((m) => m.item)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, limit);
};
