import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { knowledgeItems } from "./knowledge-items";
import { questions } from "./questions";

const coveredKiIds = new Set(questions.flatMap((q) => q.knowledgeItemIds));
const categoryIds = new Set(categories.map((c) => c.id));

describe("content integrity", () => {
  it("every question references knowledge items that exist", () => {
    const kiIds = new Set(knowledgeItems.map((k) => k.id));
    const dangling = questions
      .flatMap((q) => q.knowledgeItemIds)
      .filter((id) => !kiIds.has(id));
    expect(dangling).toEqual([]);
  });

  it("every question belongs to a real category", () => {
    const orphans = questions.filter((q) => !categoryIds.has(q.categoryId));
    expect(orphans).toEqual([]);
  });

  it("every high-importance fact is covered by at least one question", () => {
    // Uncovered high-importance facts count as permanent readiness gaps, so the
    // readiness score could never reach its ceiling — surface them here.
    const uncovered = knowledgeItems
      .filter((k) => k.importance === "high" && !coveredKiIds.has(k.id))
      .map((k) => k.id);
    expect(uncovered).toEqual([]);
  });
});
