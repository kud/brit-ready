import { describe, expect, it } from "vitest";
import { dayKey, isStreakAlive, levelFromXp, nextStreak } from "./gamification";

describe("levelFromXp", () => {
  it("starts at level 1 with no XP", () => {
    expect(levelFromXp(0)).toEqual({
      level: 1,
      xpIntoLevel: 0,
      xpForLevel: 100,
      progress: 0,
    });
  });

  it("stays on level 1 until 100 XP", () => {
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(99).progress).toBeCloseTo(0.99);
  });

  it("rolls over to the next level on each 100 XP", () => {
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(250)).toMatchObject({ level: 3, xpIntoLevel: 50, progress: 0.5 });
  });
});

describe("dayKey", () => {
  it("formats a local date as YYYY-MM-DD with zero padding", () => {
    // Constructed in local time so the assertion is timezone-independent.
    const ts = new Date(2026, 0, 5, 12, 0, 0).getTime();
    expect(dayKey(ts)).toBe("2026-01-05");
  });
});

describe("nextStreak", () => {
  it("starts a streak when there is no prior practice day", () => {
    expect(nextStreak(undefined, 0, "2026-06-20")).toBe(1);
  });

  it("keeps the streak unchanged on the same day", () => {
    expect(nextStreak("2026-06-20", 5, "2026-06-20")).toBe(5);
  });

  it("increments on a consecutive day", () => {
    expect(nextStreak("2026-06-19", 5, "2026-06-20")).toBe(6);
  });

  it("resets to 1 after a gap", () => {
    expect(nextStreak("2026-06-17", 5, "2026-06-20")).toBe(1);
  });

  it("freezes rather than resets when the last day is in the future", () => {
    expect(nextStreak("2026-06-25", 5, "2026-06-20")).toBe(5);
  });
});

describe("isStreakAlive", () => {
  it("is dead without a prior practice day", () => {
    expect(isStreakAlive(undefined, "2026-06-20")).toBe(false);
  });

  it("is alive today and yesterday", () => {
    expect(isStreakAlive("2026-06-20", "2026-06-20")).toBe(true);
    expect(isStreakAlive("2026-06-19", "2026-06-20")).toBe(true);
  });

  it("is dead after a two-day gap", () => {
    expect(isStreakAlive("2026-06-18", "2026-06-20")).toBe(false);
  });
});
