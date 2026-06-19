// Core domain types — modelled on the PRD §15 data draft.
// The product is a "mastery system": facts (KnowledgeItem) are the unit of truth,
// and Questions are interchangeable variants that probe those facts.

export const CATEGORY_IDS = [
  "values",
  "what-is-uk",
  "history",
  "modern-society",
  "government",
  "law-justice",
  "rights-responsibilities",
  "culture-traditions",
  "geography-symbols",
  "sport-arts-science",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  title: string;
  blurb: string;
  /** Single emoji used as a sober category marker. */
  icon: string;
}

export type Importance = "low" | "medium" | "high";
export type ContentStatus = "draft" | "reviewed" | "published" | "deprecated";
export type Difficulty = "easy" | "medium" | "hard";

export interface Entity {
  id: string;
  name: string;
  type: "person" | "place" | "date" | "institution" | "event" | "concept" | "symbol";
  description?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  /** The examinable fact, in original wording. */
  fact: string;
  categoryId: CategoryId;
  /** Lightweight entity tags (names) the fact is about. */
  entities: string[];
  importance: Importance;
  status: ContentStatus;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: AnswerOption[];
  correctOptionIds: string[];
  explanation: string;
  categoryId: CategoryId;
  knowledgeItemIds: string[];
  difficulty: Difficulty;
  status: ContentStatus;
}

export type AttemptMode = "diagnostic" | "practice" | "review" | "mock_exam";
export type ConfidenceMarker = "knew" | "guessed" | "unsure";

export interface Attempt {
  id: string;
  mode: AttemptMode;
  categoryId?: CategoryId;
  startedAt: number;
  completedAt?: number;
  score: number;
  totalQuestions: number;
  passed?: boolean;
}

export interface Answer {
  questionId: string;
  attemptId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  confidence?: ConfidenceMarker;
  answeredAt: number;
}

export interface UserMastery {
  knowledgeItemId: string;
  /** 0–100. */
  masteryScore: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  seen: number;
}

export type ReadinessLabel =
  | "Not ready yet"
  | "Building foundations"
  | "Almost ready"
  | "Likely ready";

export interface Readiness {
  score: number;
  label: ReadinessLabel;
  reasons: string[];
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}
