import { beforeEach, describe, expect, it, vi } from "vitest";

// The store persists via IndexedDB; stub it so the store works in node.
vi.mock("idb-keyval", () => ({
  get: vi.fn(async () => null),
  set: vi.fn(async () => {}),
  del: vi.fn(async () => {}),
}));

import { exportProgress, importProgress } from "./data-transfer";
import { useProgress } from "./store";

beforeEach(() => {
  useProgress.getState().resetProgress();
});

describe("export / import round-trip", () => {
  it("restores a previously exported snapshot", () => {
    useProgress.getState().setUserName("Sam");
    useProgress.getState().completeOnboarding("2026-12-01");
    const snapshot = exportProgress();

    useProgress.getState().resetProgress();
    expect(useProgress.getState().onboarded).toBe(false);

    expect(importProgress(snapshot)).toBe(true);
    expect(useProgress.getState().userName).toBe("Sam");
    expect(useProgress.getState().onboarded).toBe(true);
    expect(useProgress.getState().targetTestDate).toBe("2026-12-01");
  });
});

describe("importProgress validation", () => {
  it("rejects malformed JSON", () => {
    expect(importProgress("{ not json")).toBe(false);
  });

  it("rejects a payload from another app", () => {
    expect(importProgress(JSON.stringify({ app: "something-else", version: 1 }))).toBe(
      false,
    );
  });

  // Regression: a backup from a future schema version must be refused rather
  // than silently loaded with the wrong shape.
  it("rejects an unknown schema version", () => {
    expect(importProgress(JSON.stringify({ app: "brit-ready", version: 2 }))).toBe(false);
  });
});
