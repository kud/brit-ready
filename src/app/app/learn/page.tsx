"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categoryById } from "@/content/categories";
import { HydrationGate } from "@/components/hydration-gate";
import { Mascot } from "@/components/mascot";
import { QuizRunner } from "@/components/quiz-runner";
import { ROUTES } from "@/lib/routes";
import { buildSession } from "@/lib/session";
import { useProgress } from "@/lib/store";
import type { AttemptMode, CategoryId } from "@/lib/types";

const isCategory = (value: string | null): value is CategoryId =>
  !!value && value in categoryById;

interface SessionConfig {
  attemptMode: AttemptMode;
  categoryId?: CategoryId;
  count?: number;
  title: string;
}

const configFromParams = (mode: string, category: string | null): SessionConfig => {
  if (mode === "diagnostic")
    return { attemptMode: "diagnostic", count: 16, title: "Diagnostic" };
  if (mode === "review") return { attemptMode: "review", title: "Review" };
  if (mode === "topic" && isCategory(category))
    return {
      attemptMode: "practice",
      categoryId: category,
      title: categoryById[category].title,
    };
  return { attemptMode: "practice", title: "Mixed practice" };
};

const LearnSession = ({ config }: { config: SessionConfig }) => {
  const router = useRouter();
  const [round, setRound] = useState(0);

  const session = useMemo(() => {
    const { mastery, wrongQuestionIds } = useProgress.getState();
    return buildSession(
      { mode: config.attemptMode, categoryId: config.categoryId, count: config.count },
      { mastery, wrongQuestionIds },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, config]);

  const reviewIds = useMemo(
    () => useProgress.getState().wrongQuestionIds,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  );

  if (session.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <Mascot mood="happy" scale={8} />
        <p className="text-sm text-muted">Nothing to revise right now — great work!</p>
        <Link href="/app/practice" className="pixel-btn pixel-corners">
          Back to practice
        </Link>
      </div>
    );
  }

  return (
    <QuizRunner
      key={round}
      questions={session}
      mode={config.attemptMode}
      categoryId={config.categoryId}
      reviewQuestionIds={reviewIds}
      title={config.title}
      onPlayAgain={() => setRound((r) => r + 1)}
      onExit={() => router.push(ROUTES.practice)}
    />
  );
};

const LearnInner = () => {
  const params = useSearchParams();
  const config = useMemo(
    () => configFromParams(params.get("mode") ?? "mixed", params.get("category")),
    [params],
  );
  return (
    <HydrationGate>
      <LearnSession config={config} />
    </HydrationGate>
  );
};

const LearnPage = () => (
  <Suspense fallback={null}>
    <LearnInner />
  </Suspense>
);

export default LearnPage;
