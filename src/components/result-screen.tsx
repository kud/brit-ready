"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { coachOnComplete } from "@/lib/coach";
import type { CommitOutcome, SessionItemResult } from "@/lib/store";
import type { AttemptMode } from "@/lib/types";
import { Icon } from "./icon";
import { Mascot } from "./mascot";
import { ReadinessGauge } from "./readiness-gauge";

export interface ResultScreenProps {
  outcome: CommitOutcome;
  mode: AttemptMode;
  items: SessionItemResult[];
  readinessLabel: string;
  onPlayAgain?: () => void;
}

const correctTextOf = (item: SessionItemResult) =>
  item.question.options.find((o) => item.question.correctOptionIds.includes(o.id))?.text ??
  "";

const selectedTextOf = (item: SessionItemResult) =>
  item.question.options.find((o) => item.selectedOptionIds.includes(o.id))?.text;

export const ResultScreen = ({
  outcome,
  mode,
  items,
  readinessLabel,
  onPlayAgain,
}: ResultScreenProps) => {
  const ratio = outcome.total ? outcome.score / outcome.total : 0;
  const summary = coachOnComplete({
    mode: mode as never,
    ratio,
    passed: outcome.passed,
  });
  const wrongItems = items.filter((i) => !i.isCorrect);
  const delta = outcome.readinessAfter - outcome.readinessBefore;

  return (
    <div className="flex flex-col gap-5 px-4 pt-8 pb-10">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 16 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <Mascot mood={summary.mood} scale={9} />
        <h1 className="font-display text-lg text-shadow-pixel">{summary.headline}</h1>
        <p className="max-w-xs text-sm text-muted">{summary.text}</p>
      </motion.div>

      <div className="pixel-panel pixel-corners flex items-center justify-around px-4 py-5">
        <div className="text-center">
          <div className="font-display text-3xl text-brand text-shadow-pixel">
            {outcome.score}
            <span className="text-base text-muted">/{outcome.total}</span>
          </div>
          <div className="font-display mt-1 text-[0.55rem] uppercase text-faint">Score</div>
        </div>
        <div className="text-center">
          <div className="font-display text-3xl text-gold text-shadow-pixel">
            +{outcome.xpGained}
          </div>
          <div className="font-display mt-1 text-[0.55rem] uppercase text-faint">XP</div>
        </div>
        {outcome.levelAfter > outcome.levelBefore && (
          <div className="text-center">
            <div className="font-display text-3xl text-accent text-shadow-pixel">
              L{outcome.levelAfter}
            </div>
            <div className="font-display mt-1 text-[0.55rem] uppercase text-faint">
              Level up
            </div>
          </div>
        )}
      </div>

      <div className="pixel-panel pixel-corners flex flex-col items-center gap-2 px-4 py-5">
        <ReadinessGauge
          score={outcome.readinessAfter}
          label={readinessLabel as never}
          size="compact"
        />
        {delta !== 0 && (
          <p className="text-xs text-muted">
            Readiness {delta > 0 ? "▲" : "▼"} {Math.abs(delta)} (was{" "}
            {outcome.readinessBefore})
          </p>
        )}
        <p className="text-center text-[0.7rem] text-faint">
          Guidance only — aim for a buffer above the 75% pass mark.
        </p>
      </div>

      {outcome.newBadges.length > 0 && (
        <div className="pixel-panel pixel-corners px-4 py-4">
          <p className="font-display mb-3 text-[0.6rem] uppercase text-gold">
            New badge{outcome.newBadges.length > 1 ? "s" : ""}!
          </p>
          <div className="flex flex-wrap gap-3">
            {outcome.newBadges.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="flex items-center gap-2"
              >
                <Icon name={b.icon} size={22} className="text-gold" />
                <span className="text-xs">{b.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {wrongItems.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-danger">
            Learn from {wrongItems.length} miss{wrongItems.length > 1 ? "es" : ""}
          </p>
          {wrongItems.map((item) => (
            <div key={item.question.id} className="pixel-panel px-3 py-3">
              <p className="mb-2 text-sm font-semibold">{item.question.prompt}</p>
              {selectedTextOf(item) ? (
                <p className="flex items-start gap-1.5 text-sm text-danger">
                  <X size={15} className="mt-0.5 shrink-0" /> {selectedTextOf(item)}
                </p>
              ) : (
                <p className="text-sm italic text-faint">Skipped</p>
              )}
              <p className="mt-1 flex items-start gap-1.5 text-sm text-brand">
                <Check size={15} className="mt-0.5 shrink-0" /> {correctTextOf(item)}
              </p>
              <p className="mt-2 text-xs text-muted">{item.question.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {onPlayAgain && (
          <button className="pixel-btn pixel-corners w-full" onClick={onPlayAgain}>
            Play again
          </button>
        )}
        <Link
          href="/app/revise"
          className="pixel-btn pixel-btn-accent pixel-corners w-full text-center"
        >
          Revise weak facts
        </Link>
        <Link
          href="/app"
          className="pixel-btn pixel-btn-ghost pixel-corners w-full text-center"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};
