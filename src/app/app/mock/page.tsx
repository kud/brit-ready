"use client";

import { useMemo, useState } from "react";
import { Play, Timer } from "lucide-react";
import { HydrationGate } from "@/components/hydration-gate";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { QuizRunner } from "@/components/quiz-runner";
import { buildSession, MOCK_DURATION_MS } from "@/lib/session";
import { useProgress } from "@/lib/store";
import { useDerived } from "@/lib/use-derived";

const MockRun = ({
  onPlayAgain,
  onExit,
}: {
  onPlayAgain: () => void;
  onExit: () => void;
}) => {
  const session = useMemo(() => {
    const { mastery, wrongQuestionIds } = useProgress.getState();
    return buildSession({ mode: "mock_exam" }, { mastery, wrongQuestionIds });
  }, []);
  const reviewIds = useMemo(() => useProgress.getState().wrongQuestionIds, []);

  return (
    <QuizRunner
      questions={session}
      mode="mock_exam"
      reviewQuestionIds={reviewIds}
      durationMs={MOCK_DURATION_MS}
      title="Mock exam"
      onPlayAgain={onPlayAgain}
      onExit={onExit}
    />
  );
};

const MockInner = () => {
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const { stats } = useDerived();

  if (started)
    return (
      <MockRun
        key={round}
        onPlayAgain={() => setRound((r) => r + 1)}
        onExit={() => setStarted(false)}
      />
    );

  return (
    <div className="pb-6">
      <PageHeader
        title="Mock Exam"
        subtitle="The real format — no feedback until the end."
        icon={<Timer size={24} />}
        accent="var(--color-accent)"
      />

      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <Mascot mood="think" scale={8} />

        <div className="pixel-panel w-full px-4 py-4">
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Questions</span>
              <span className="font-mono font-semibold">24</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Time limit</span>
              <span className="font-mono font-semibold">45:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Pass mark</span>
              <span className="font-mono font-semibold text-brand">75%</span>
            </li>
            {stats.bestMockScore !== null && (
              <li className="flex justify-between border-t border-border pt-3">
                <span className="text-muted">Your best</span>
                <span className="font-mono font-semibold text-gold">
                  {stats.bestMockScore}/24
                </span>
              </li>
            )}
          </ul>
        </div>

        <p className="text-center text-xs text-faint">
          You won&apos;t see whether each answer is right until you finish — just like the
          real test.
        </p>

        <button
          onClick={() => setStarted(true)}
          className="pixel-btn flex w-full items-center justify-center gap-2"
        >
          <Play size={18} fill="currentColor" /> Start mock exam
        </button>
      </div>
    </div>
  );
};

const MockPage = () => (
  <HydrationGate>
    <MockInner />
  </HydrationGate>
);

export default MockPage;
