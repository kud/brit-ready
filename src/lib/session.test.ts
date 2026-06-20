import { describe, expect, it } from "vitest";
import { categories } from "@/content/categories";
import { questions } from "@/content/questions";
import { MOCK_QUESTION_COUNT, buildSession, reviewableCount } from "./session";
import type { UserMastery } from "./types";

const primaryKi = (id: string) => questions.find((q) => q.id === id)!.knowledgeItemIds[0];

const emptyCtx = { mastery: {} as Record<string, UserMastery>, wrongQuestionIds: [] };

describe("buildSession", () => {
  it("builds a full mock with unique questions and facts", () => {
    const session = buildSession({ mode: "mock_exam" }, emptyCtx);
    expect(session).toHaveLength(MOCK_QUESTION_COUNT);
    const ids = session.map((q) => q.id);
    expect(new Set(ids).size).toBe(session.length);
    const kis = ids.map(primaryKi);
    expect(new Set(kis).size).toBe(kis.length);
  });

  it("returns the default count for mixed practice and diagnostics", () => {
    expect(buildSession({ mode: "practice" }, emptyCtx)).toHaveLength(10);
    expect(buildSession({ mode: "diagnostic" }, emptyCtx)).toHaveLength(16);
  });

  it("restricts a topic session to its category", () => {
    const categoryId = categories[0].id;
    const session = buildSession({ mode: "practice", categoryId }, emptyCtx);
    expect(session.length).toBeGreaterThan(0);
    expect(session.length).toBeLessThanOrEqual(10);
    expect(session.every((q) => q.categoryId === categoryId)).toBe(true);
  });
});

describe("reviewableCount", () => {
  it("counts questions the user previously got wrong", () => {
    const ctx = { mastery: {}, wrongQuestionIds: [questions[0].id] };
    expect(reviewableCount(ctx, Date.now())).toBeGreaterThanOrEqual(1);
  });

  it("counts overdue facts but not future ones", () => {
    const now = 1_700_000_000_000;
    const ki = questions[0].knowledgeItemIds[0];
    const overdue = {
      mastery: { [ki]: { nextReviewAt: now - 1000, seen: 1 } as UserMastery },
      wrongQuestionIds: [],
    };
    const future = {
      mastery: { [ki]: { nextReviewAt: now + 1000, seen: 1 } as UserMastery },
      wrongQuestionIds: [],
    };
    expect(reviewableCount(overdue, now)).toBeGreaterThanOrEqual(1);
    expect(reviewableCount(future, now)).toBe(0);
  });
});
