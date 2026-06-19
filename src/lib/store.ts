import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { badgeById, evaluateBadges } from "./badges";
import {
  dayKey,
  levelFromXp,
  nextStreak,
  XP_MOCK_PASS_BONUS,
  XP_PER_ANSWER,
  XP_PER_CORRECT,
} from "./gamification";
import { idbStorage } from "./idb-storage";
import { updateMastery } from "./mastery";
import { computeReadiness } from "./readiness";
import { MOCK_PASS_RATIO } from "./session";
import { computeStats } from "./stats";
import type {
  Answer,
  Attempt,
  AttemptMode,
  BadgeDefinition,
  CategoryId,
  ConfidenceMarker,
  Question,
  UserMastery,
} from "./types";

export interface SessionItemResult {
  question: Question;
  selectedOptionIds: string[];
  isCorrect: boolean;
  confidence?: ConfidenceMarker;
  /** True if this question was in the review queue when the session started. */
  wasReview: boolean;
}

export interface SessionResult {
  mode: AttemptMode;
  categoryId?: CategoryId;
  startedAt: number;
  items: SessionItemResult[];
}

export interface CommitOutcome {
  attemptId: string;
  score: number;
  total: number;
  passed?: boolean;
  xpGained: number;
  newBadges: BadgeDefinition[];
  readinessBefore: number;
  readinessAfter: number;
  streakCount: number;
  levelBefore: number;
  levelAfter: number;
}

interface ProgressState {
  hasHydrated: boolean;
  onboarded: boolean;
  userName?: string;
  targetTestDate?: string;
  remindersEnabled: boolean;
  soundEnabled: boolean;
  mascotStyle: "pixel" | "soft";
  xp: number;
  streakCount: number;
  lastPracticeDay?: string;
  mastery: Record<string, UserMastery>;
  attempts: Attempt[];
  answers: Answer[];
  wrongQuestionIds: string[];
  reviewCorrections: number;
  unlockedBadgeIds: string[];

  setHasHydrated: (value: boolean) => void;
  completeOnboarding: (targetTestDate?: string) => void;
  setTargetDate: (date?: string) => void;
  setUserName: (name?: string) => void;
  setReminders: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setMascotStyle: (style: "pixel" | "soft") => void;
  commitSession: (result: SessionResult) => CommitOutcome;
  resetProgress: () => void;
}

let attemptSeq = 0;
const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(attemptSeq += 1)}`;

const initialData = {
  onboarded: false,
  userName: undefined as string | undefined,
  targetTestDate: undefined as string | undefined,
  remindersEnabled: false,
  soundEnabled: true,
  mascotStyle: "pixel" as "pixel" | "soft",
  xp: 0,
  streakCount: 0,
  lastPracticeDay: undefined as string | undefined,
  mastery: {} as Record<string, UserMastery>,
  attempts: [] as Attempt[],
  answers: [] as Answer[],
  wrongQuestionIds: [] as string[],
  reviewCorrections: 0,
  unlockedBadgeIds: [] as string[],
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialData,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      completeOnboarding: (targetTestDate) => set({ onboarded: true, targetTestDate }),

      setTargetDate: (date) => set({ targetTestDate: date }),

      setUserName: (name) => set({ userName: name?.trim() || undefined }),

      setReminders: (enabled) => set({ remindersEnabled: enabled }),

      setSound: (enabled) => set({ soundEnabled: enabled }),

      setMascotStyle: (style) => set({ mascotStyle: style }),

      resetProgress: () => set({ ...initialData }),

      commitSession: (result) => {
        const state = get();
        const now = Date.now();
        const today = dayKey(now);

        const beforeStats = computeStats(state.mastery, state.attempts, state.answers);
        const readinessBefore = computeReadiness({
          stats: beforeStats,
          streakCount: state.streakCount,
          lastPracticeDay: state.lastPracticeDay,
          today,
        }).score;

        const score = result.items.filter((i) => i.isCorrect).length;
        const total = result.items.length;
        const passed =
          result.mode === "mock_exam" ? score / total >= MOCK_PASS_RATIO : undefined;

        const attempt: Attempt = {
          id: makeId("attempt"),
          mode: result.mode,
          categoryId: result.categoryId,
          startedAt: result.startedAt,
          completedAt: now,
          score,
          totalQuestions: total,
          passed,
        };

        const mastery = { ...state.mastery };
        const newAnswers: Answer[] = [];
        const wrong = new Set(state.wrongQuestionIds);
        let reviewCorrections = state.reviewCorrections;

        for (const item of result.items) {
          for (const kiId of item.question.knowledgeItemIds) {
            mastery[kiId] = updateMastery(kiId, mastery[kiId], item.isCorrect, now);
          }
          newAnswers.push({
            questionId: item.question.id,
            attemptId: attempt.id,
            selectedOptionIds: item.selectedOptionIds,
            isCorrect: item.isCorrect,
            confidence: item.confidence,
            answeredAt: now,
          });
          if (item.isCorrect) {
            wrong.delete(item.question.id);
            if (item.wasReview) reviewCorrections += 1;
          } else {
            wrong.add(item.question.id);
          }
        }

        const xpGained =
          result.items.reduce(
            (sum, i) => sum + XP_PER_ANSWER + (i.isCorrect ? XP_PER_CORRECT : 0),
            0,
          ) + (passed ? XP_MOCK_PASS_BONUS : 0);
        const xp = state.xp + xpGained;

        const streakCount = nextStreak(state.lastPracticeDay, state.streakCount, today);
        const attempts = [...state.attempts, attempt];
        const answers = [...state.answers, ...newAnswers];

        const afterStats = computeStats(mastery, attempts, answers);
        const readinessAfter = computeReadiness({
          stats: afterStats,
          streakCount,
          lastPracticeDay: today,
          today,
        }).score;

        const practiceSessions = attempts.filter((a) => a.mode !== "mock_exam").length;
        const unlocked = evaluateBadges({
          stats: afterStats,
          practiceSessions,
          reviewCorrections,
          streakCount,
          readinessScore: readinessAfter,
        });
        const newBadgeIds = unlocked.filter((id) => !state.unlockedBadgeIds.includes(id));

        set({
          mastery,
          answers,
          attempts,
          wrongQuestionIds: [...wrong],
          reviewCorrections,
          xp,
          streakCount,
          lastPracticeDay: today,
          unlockedBadgeIds: [...state.unlockedBadgeIds, ...newBadgeIds],
        });

        return {
          attemptId: attempt.id,
          score,
          total,
          passed,
          xpGained,
          newBadges: newBadgeIds.map((id) => badgeById.get(id)!).filter(Boolean),
          readinessBefore,
          readinessAfter,
          streakCount,
          levelBefore: levelFromXp(state.xp).level,
          levelAfter: levelFromXp(xp).level,
        };
      },
    }),
    {
      name: "brit-ready-progress",
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        onboarded: s.onboarded,
        userName: s.userName,
        targetTestDate: s.targetTestDate,
        remindersEnabled: s.remindersEnabled,
        soundEnabled: s.soundEnabled,
        mascotStyle: s.mascotStyle,
        xp: s.xp,
        streakCount: s.streakCount,
        lastPracticeDay: s.lastPracticeDay,
        mastery: s.mastery,
        attempts: s.attempts,
        answers: s.answers,
        wrongQuestionIds: s.wrongQuestionIds,
        reviewCorrections: s.reviewCorrections,
        unlockedBadgeIds: s.unlockedBadgeIds,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
