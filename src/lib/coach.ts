import type { MascotMood } from "@/components/mascot";

// The coach turns dry right/wrong into encouragement. Unlike a pure streak
// nag, its tone is tied to genuine progress: praise escalates with combos and
// readiness, and every miss is framed as learning, not failure.

export interface CoachLine {
  text: string;
  mood: MascotMood;
}

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export interface GreetingContext {
  streakCount: number;
  toReview: number;
  readinessScore: number;
  hasMock: boolean;
  totalAnswered: number;
}

// Warm, characterful home greetings. Deterministic (indexed, not random) so
// they're safe to compute during render but still rotate as you progress.
const rotate = (lines: string[], seed: number) => lines[seed % lines.length];

export const coachGreeting = (ctx: GreetingContext): CoachLine => {
  if (ctx.totalAnswered === 0)
    return {
      text: "Welcome aboard! Shall we find out what you already know?",
      mood: "happy",
    };
  if (ctx.readinessScore >= 80)
    return {
      text: rotate(
        [
          "You're shining today — properly test-ready.",
          "Look at you go. Book that test with confidence.",
          "Top form. One more mock just to be sure?",
        ],
        ctx.totalAnswered,
      ),
      mood: "celebrate",
    };
  if (ctx.streakCount >= 3)
    return {
      text: rotate(
        [
          `${ctx.streakCount} days on the trot — you're on fire!`,
          `${ctx.streakCount}-day streak and counting. Smashing it.`,
          "Back again? That's the spirit I like to see.",
        ],
        ctx.streakCount,
      ),
      mood: "celebrate",
    };
  if (ctx.toReview > 0)
    return {
      text: `${ctx.toReview} fact${ctx.toReview === 1 ? "" : "s"} to revisit — let's lock them in.`,
      mood: "think",
    };
  if (!ctx.hasMock)
    return {
      text: rotate(
        [
          "Feeling brave? A mock exam shows exactly where you stand.",
          "Ready to see your readiness? Give a mock a go.",
        ],
        ctx.totalAnswered,
      ),
      mood: "happy",
    };
  return {
    text: rotate(
      [
        "Good to see you back. Shall we?",
        "Right then — a quick session and you're sharper already.",
        "Steady progress wins this. Let's add a little more.",
        "On duty and ready when you are.",
        "Lovely to have you back. Let's make it count.",
      ],
      ctx.totalAnswered,
    ),
    mood: "happy",
  };
};

const correctLines = [
  "Spot on!",
  "Nicely done.",
  "That's the one.",
  "Correct — you've got this.",
  "Sharp work.",
  "Jolly good, old chap!",
  "Most excellent, sire!",
  "Right first time!",
  "Huzzah! Correct.",
  "You're shining today.",
];

const comboLines = [
  "On a roll!",
  "Three in a row — brilliant.",
  "Unstoppable!",
  "By Jove, you're flying!",
  "Mastery in motion.",
  "Huzzah! A glorious streak!",
  "Crikey, you're good at this.",
  "Now you're showing off — I love it.",
];

const incorrectLines = [
  "Not quite — here's the why.",
  "Alas, not this time — read on.",
  "Close. Let's lock this fact in.",
  "Fear not, good sir — we shall learn it.",
  "Tricky one. Read the explanation below.",
  "A worthy attempt. Onwards!",
  "Right, let's make sure that one sticks.",
];

export const coachOnAnswer = (isCorrect: boolean, combo: number): CoachLine => {
  if (!isCorrect) return { text: pick(incorrectLines), mood: "encourage" };
  if (combo >= 3) return { text: pick(comboLines), mood: "celebrate" };
  return { text: pick(correctLines), mood: "happy" };
};

export interface CompleteSummary {
  mode: "diagnostic" | "practice" | "review" | "mock_exam";
  ratio: number; // 0..1
  passed?: boolean;
}

export const coachOnComplete = ({
  mode,
  ratio,
  passed,
}: CompleteSummary): { headline: string; text: string; mood: MascotMood } => {
  if (mode === "mock_exam") {
    return passed
      ? {
          headline: "You passed!",
          text: "Above the 75% mark. Keep stacking mocks to be sure.",
          mood: "celebrate",
        }
      : {
          headline: "Not this time",
          text: "Below 75%. Revise your weak facts and go again — you're closer than you think.",
          mood: "encourage",
        };
  }

  if (ratio >= 0.9)
    return {
      headline: "Outstanding",
      text: "Nearly flawless. Your mastery is climbing.",
      mood: "celebrate",
    };
  if (ratio >= 0.6)
    return {
      headline: "Good progress",
      text: "Solid session. Review the ones you missed to seal them in.",
      mood: "happy",
    };
  return {
    headline: "Every fact counts",
    text: "That's how mastery is built — the misses become tomorrow's wins.",
    mood: "encourage",
  };
};
