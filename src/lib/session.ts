import { questions } from "@/content/questions";
import { knowledgeItemById } from "@/content/knowledge-items";
import { categories } from "@/content/categories";
import { isOverdue } from "./mastery";
import type { AttemptMode, CategoryId, Question, UserMastery } from "./types";

export const MOCK_QUESTION_COUNT = 24;
export const MOCK_DURATION_MS = 45 * 60 * 1000;
export const MOCK_PASS_RATIO = 0.75;
const DEFAULT_PRACTICE_COUNT = 10;
const DEFAULT_DIAGNOSTIC_COUNT = 16;

const shuffle = <T>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const primaryKi = (question: Question) => question.knowledgeItemIds[0];

export interface SessionRequest {
  mode: AttemptMode;
  categoryId?: CategoryId;
  count?: number;
}

interface SessionContext {
  mastery: Record<string, UserMastery>;
  wrongQuestionIds: string[];
}

const weightFor = (
  question: Question,
  { mastery, wrongQuestionIds }: SessionContext,
  now: number,
): number => {
  let weight = 1;
  const m = mastery[primaryKi(question)];

  if (!m || !m.seen) {
    weight += 2; // unseen facts are worth introducing
  } else {
    weight += (100 - m.masteryScore) / 25; // weaker → heavier
    if (isOverdue(m, now)) weight += 3;
  }

  if (wrongQuestionIds.includes(question.id)) weight += 4;
  if (knowledgeItemById.get(primaryKi(question))?.importance === "high") weight *= 1.3;

  return weight;
};

/** Weighted sampling without replacement that avoids repeating a fact in one session. */
const weightedSample = (
  pool: Question[],
  count: number,
  ctx: SessionContext,
  now: number,
): Question[] => {
  const remaining = [...pool];
  const usedKi = new Set<string>();
  const picked: Question[] = [];

  while (picked.length < count && remaining.length > 0) {
    const candidates = remaining.filter((q) => !usedKi.has(primaryKi(q)));
    const usable = candidates.length > 0 ? candidates : remaining;

    const weights = usable.map((q) => weightFor(q, ctx, now));
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    let index = 0;
    while (index < weights.length - 1 && roll > weights[index]) {
      roll -= weights[index];
      index += 1;
    }

    const chosen = usable[index];
    picked.push(chosen);
    usedKi.add(primaryKi(chosen));
    remaining.splice(remaining.indexOf(chosen), 1);
  }

  return picked;
};

/** Balanced, random selection across all categories — mirrors the real exam. */
const buildMock = (): Question[] => {
  const byCategory = categories.map((c) =>
    shuffle(questions.filter((q) => q.categoryId === c.id)),
  );
  const usedKi = new Set<string>();
  const picked: Question[] = [];

  let progressed = true;
  while (picked.length < MOCK_QUESTION_COUNT && progressed) {
    progressed = false;
    for (const bucket of byCategory) {
      if (picked.length >= MOCK_QUESTION_COUNT) break;
      const next = bucket.find((q) => !usedKi.has(primaryKi(q)) && !picked.includes(q));
      if (next) {
        picked.push(next);
        usedKi.add(primaryKi(next));
        progressed = true;
      }
    }
  }

  return shuffle(picked);
};

export const buildSession = (req: SessionRequest, ctx: SessionContext): Question[] => {
  const now = Date.now();

  if (req.mode === "mock_exam") return buildMock();

  if (req.mode === "diagnostic") {
    const count = req.count ?? DEFAULT_DIAGNOSTIC_COUNT;
    return weightedSample(questions, count, { mastery: {}, wrongQuestionIds: [] }, now);
  }

  if (req.mode === "review") {
    const count = req.count ?? DEFAULT_PRACTICE_COUNT;
    const pool = questions.filter((q) => {
      if (ctx.wrongQuestionIds.includes(q.id)) return true;
      const m = ctx.mastery[primaryKi(q)];
      return m ? isOverdue(m, now) : false;
    });
    return weightedSample(pool.length ? pool : questions, count, ctx, now);
  }

  // topic practice or mixed practice
  const count = req.count ?? DEFAULT_PRACTICE_COUNT;
  const pool = req.categoryId
    ? questions.filter((q) => q.categoryId === req.categoryId)
    : questions;
  return weightedSample(pool, count, ctx, now);
};

/** How many questions are available for review at the given time. */
export const reviewableCount = (ctx: SessionContext, now: number = Date.now()): number =>
  questions.filter((q) => {
    if (ctx.wrongQuestionIds.includes(q.id)) return true;
    const m = ctx.mastery[primaryKi(q)];
    return m ? isOverdue(m, now) : false;
  }).length;
