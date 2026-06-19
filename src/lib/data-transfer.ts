import { useProgress } from "./store";

// Backup / restore for the local-first progress. Since everything lives on the
// device, export gives users a portable JSON they can re-import elsewhere.

const FIELDS = [
  "onboarded",
  "userName",
  "targetTestDate",
  "xp",
  "streakCount",
  "lastPracticeDay",
  "mastery",
  "attempts",
  "answers",
  "wrongQuestionIds",
  "reviewCorrections",
  "unlockedBadgeIds",
] as const;

export const exportProgress = (): string => {
  const state = useProgress.getState() as unknown as Record<string, unknown>;
  const data: Record<string, unknown> = { app: "brit-ready", version: 1 };
  for (const field of FIELDS) data[field] = state[field];
  return JSON.stringify(data, null, 2);
};

export const importProgress = (json: string): boolean => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return false;
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as Record<string, unknown>).app !== "brit-ready"
  ) {
    return false;
  }
  const source = parsed as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const field of FIELDS) if (field in source) patch[field] = source[field];
  useProgress.setState(patch as never);
  return true;
};

export const downloadProgress = () => {
  if (typeof document === "undefined") return;
  const blob = new Blob([exportProgress()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "brit-ready-backup.json";
  a.click();
  URL.revokeObjectURL(url);
};
