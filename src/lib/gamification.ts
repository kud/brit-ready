// XP and streak rules. Kept deliberately simple and predictable so progress
// feels fair: linear levels, one level every 100 XP.

export const XP_PER_CORRECT = 10;
export const XP_PER_ANSWER = 2;
export const XP_MOCK_PASS_BONUS = 50;
export const XP_PER_LEVEL = 100;

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForLevel: number;
  progress: number; // 0..1
}

export const levelFromXp = (xp: number): LevelInfo => {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForLevel: XP_PER_LEVEL,
    progress: xpIntoLevel / XP_PER_LEVEL,
  };
};

/** Local calendar day as YYYY-MM-DD, used for streak bookkeeping. */
export const dayKey = (timestamp: number): string => {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const daysBetween = (from: string, to: string) => {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
};

/**
 * Given the last practice day and today, return the new streak count.
 * Same day → unchanged; consecutive day → +1; any gap → reset to 1.
 */
export const nextStreak = (
  lastPracticeDay: string | undefined,
  currentStreak: number,
  today: string,
): number => {
  if (!lastPracticeDay) return 1;
  const gap = daysBetween(lastPracticeDay, today);
  if (gap <= 0) return Math.max(currentStreak, 1);
  if (gap === 1) return currentStreak + 1;
  return 1;
};

/** A streak is "alive" only if the last practice was today or yesterday. */
export const isStreakAlive = (
  lastPracticeDay: string | undefined,
  today: string,
): boolean => {
  if (!lastPracticeDay) return false;
  return daysBetween(lastPracticeDay, today) <= 1;
};
