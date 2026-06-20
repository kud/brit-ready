import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("idb-keyval", () => ({
  get: vi.fn(async () => null),
  set: vi.fn(async () => {}),
  del: vi.fn(async () => {}),
}));

import { questions } from "@/content/questions";
import { XP_MOCK_PASS_BONUS, XP_PER_ANSWER, XP_PER_CORRECT } from "./gamification";
import { useProgress, type SessionItemResult, type SessionResult } from "./store";

const item = (index: number, isCorrect: boolean, wasReview = false): SessionItemResult => {
  const question = questions[index];
  return {
    question,
    selectedOptionIds: isCorrect ? question.correctOptionIds : [],
    isCorrect,
    wasReview,
  };
};

const session = (
  mode: SessionResult["mode"],
  items: SessionItemResult[],
): SessionResult => ({ mode, startedAt: 0, items });

beforeEach(() => {
  useProgress.getState().resetProgress();
});

describe("commitSession", () => {
  it("tallies score and XP for a practice session", () => {
    const outcome = useProgress
      .getState()
      .commitSession(session("practice", [item(0, true), item(1, false)]));

    expect(outcome.score).toBe(1);
    expect(outcome.total).toBe(2);
    // 2 answers × base XP, plus one correct bonus.
    expect(outcome.xpGained).toBe(2 * XP_PER_ANSWER + XP_PER_CORRECT);
    expect(useProgress.getState().xp).toBe(outcome.xpGained);
  });

  it("starts the streak and records the practice day", () => {
    useProgress.getState().commitSession(session("practice", [item(0, true)]));
    const state = useProgress.getState();
    expect(state.streakCount).toBe(1);
    expect(state.lastPracticeDay).toBeDefined();
  });

  it("updates mastery for every knowledge item in a correct answer", () => {
    useProgress.getState().commitSession(session("practice", [item(0, true)]));
    const { mastery } = useProgress.getState();
    for (const ki of questions[0].knowledgeItemIds) {
      expect(mastery[ki].masteryScore).toBe(20);
      expect(mastery[ki].consecutiveCorrect).toBe(1);
      expect(mastery[ki].seen).toBe(1);
    }
  });

  it("passes a full-correct mock and awards the pass bonus", () => {
    const items = Array.from({ length: 24 }, (_, i) => item(i, true));
    const outcome = useProgress.getState().commitSession(session("mock_exam", items));
    expect(outcome.passed).toBe(true);
    expect(outcome.score).toBe(24);
    expect(outcome.xpGained).toBe(
      24 * XP_PER_ANSWER + 24 * XP_PER_CORRECT + XP_MOCK_PASS_BONUS,
    );
  });

  it("moves a wrong question into review, then clears it once answered right", () => {
    useProgress.getState().commitSession(session("practice", [item(0, false)]));
    expect(useProgress.getState().wrongQuestionIds).toContain(questions[0].id);

    useProgress.getState().commitSession(session("review", [item(0, true, true)]));
    expect(useProgress.getState().wrongQuestionIds).not.toContain(questions[0].id);
    expect(useProgress.getState().reviewCorrections).toBe(1);
  });
});
