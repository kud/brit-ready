// Central route table. The marketing landing lives at "/"; the whole app is
// nested under "/app" so the two can have entirely different shells.
export const ROUTES = {
  landing: "/",
  app: "/app",
  onboarding: "/app/onboarding",
  practice: "/app/practice",
  mock: "/app/mock",
  revise: "/app/revise",
  progress: "/app/progress",
  about: "/about",
  category: (id: string) => `/app/category/${id}`,
  learn: (mode: string, category?: string) =>
    category ? `/app/learn?mode=${mode}&category=${category}` : `/app/learn?mode=${mode}`,
} as const;
