import type { Category, CategoryId } from "@/lib/types";

// The 10 knowledge categories (PRD §10.2). The `icon` is a key into the SVG
// icon registry (src/components/icon.tsx) — no emoji in the interface.
export const categories: Category[] = [
  {
    id: "values",
    title: "Values & Principles",
    blurb: "The fundamental principles and shared values of British life.",
    icon: "scale",
  },
  {
    id: "what-is-uk",
    title: "What is the UK?",
    blurb: "The nations, flags and make-up of the United Kingdom.",
    icon: "map",
  },
  {
    id: "history",
    title: "UK History",
    blurb: "From early Britain through to the modern age.",
    icon: "castle",
  },
  {
    id: "modern-society",
    title: "Modern Society",
    blurb: "Population, religion, customs and everyday life today.",
    icon: "building",
  },
  {
    id: "government",
    title: "Government & Democracy",
    blurb: "Parliament, elections and how the country is run.",
    icon: "landmark",
  },
  {
    id: "law-justice",
    title: "Law & Justice",
    blurb: "Courts, the police and the legal system.",
    icon: "gavel",
  },
  {
    id: "rights-responsibilities",
    title: "Rights & Responsibilities",
    blurb: "What you can expect, and what is expected of you.",
    icon: "handshake",
  },
  {
    id: "culture-traditions",
    title: "Culture & Traditions",
    blurb: "Festivals, customs and traditions across the year.",
    icon: "drama",
  },
  {
    id: "geography-symbols",
    title: "Geography & Symbols",
    blurb: "Landmarks, patron saints and national symbols.",
    icon: "flag",
  },
  {
    id: "sport-arts-science",
    title: "Sport, Arts & Science",
    blurb: "Notable figures in sport, the arts, literature and science.",
    icon: "medal",
  },
];

export const categoryById: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
