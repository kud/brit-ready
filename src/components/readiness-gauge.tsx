"use client";

import { motion } from "motion/react";
import type { ReadinessLabel } from "@/lib/types";

const SEGMENTS = 20;

const colourFor = (score: number): string => {
  if (score >= 80) return "var(--color-brand)";
  if (score >= 65) return "var(--color-gold)";
  if (score >= 40) return "var(--color-accent)";
  return "var(--color-danger)";
};

export interface ReadinessGaugeProps {
  score: number;
  label: ReadinessLabel;
  /** Compact variant for headers; full shows the big number + label. */
  size?: "full" | "compact";
}

export const ReadinessGauge = ({ score, label, size = "full" }: ReadinessGaugeProps) => {
  const filled = Math.round((score / 100) * SEGMENTS);
  const colour = colourFor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      {size === "full" && (
        <div className="text-center">
          <motion.div
            key={score}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
            className="font-display text-4xl text-shadow-pixel"
            style={{ color: colour }}
          >
            {score}
          </motion.div>
          <div className="font-display mt-2 text-[0.6rem] uppercase tracking-wide text-muted">
            Readiness
          </div>
        </div>
      )}

      <div
        className="flex gap-[3px]"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Readiness ${score} of 100: ${label}`}
      >
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{
              backgroundColor: i < filled ? colour : "var(--color-border-strong)",
            }}
            transition={{ delay: i * 0.018, duration: 0.12 }}
            className="h-4 w-[5px] rounded-[2px]"
          />
        ))}
      </div>

      <div
        className="font-mono text-[0.7rem] uppercase tracking-wide"
        style={{ color: colour }}
      >
        {label}
      </div>
    </div>
  );
};
