"use client";

import { useMemo, useSyncExternalStore } from "react";
import { dayKey, levelFromXp } from "./gamification";
import { computeReadiness } from "./readiness";
import { reviewableCount } from "./session";
import { computeStats } from "./stats";
import { useProgress } from "./store";

// A stable, cached mount-time timestamp via an external store. This keeps
// render pure (no Date.now in the body) without a setState-in-effect.
let cachedNow = 0;
const subscribeNow = () => () => {};
const getNowSnapshot = () => {
  if (!cachedNow) cachedNow = Date.now();
  return cachedNow;
};
const getServerNow = () => 0;

const useNow = () => useSyncExternalStore(subscribeNow, getNowSnapshot, getServerNow);

/** Derives stats, readiness, level and review count from raw progress state. */
export const useDerived = () => {
  const mastery = useProgress((s) => s.mastery);
  const attempts = useProgress((s) => s.attempts);
  const answers = useProgress((s) => s.answers);
  const xp = useProgress((s) => s.xp);
  const streakCount = useProgress((s) => s.streakCount);
  const lastPracticeDay = useProgress((s) => s.lastPracticeDay);
  const wrongQuestionIds = useProgress((s) => s.wrongQuestionIds);
  const now = useNow();

  return useMemo(() => {
    const stats = computeStats(mastery, attempts, answers);
    const today = dayKey(
      now || Date.parse(`${lastPracticeDay ?? "1970-01-01"}T00:00:00`) + 1,
    );
    const readiness = computeReadiness({ stats, streakCount, lastPracticeDay, today });
    const level = levelFromXp(xp);
    const toReview = reviewableCount({ mastery, wrongQuestionIds }, now);
    return { stats, readiness, level, xp, streakCount, lastPracticeDay, toReview };
  }, [mastery, attempts, answers, xp, streakCount, lastPracticeDay, wrongQuestionIds, now]);
};
