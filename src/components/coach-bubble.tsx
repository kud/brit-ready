"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mascot, type MascotMood } from "./mascot";

export interface CoachBubbleProps {
  mood: MascotMood;
  text: string;
  tone?: "neutral" | "correct" | "wrong";
}

const toneBorder: Record<NonNullable<CoachBubbleProps["tone"]>, string> = {
  neutral: "var(--color-border-strong)",
  correct: "var(--color-brand)",
  wrong: "var(--color-danger)",
};

export const CoachBubble = ({ mood, text, tone = "neutral" }: CoachBubbleProps) => (
  <div className="flex items-center gap-1">
    <Mascot mood={mood} scale={7} bob={mood === "happy" || mood === "celebrate"} />
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, scale: 0.96, x: -4 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative flex-1 rounded-2xl border bg-card px-4 py-3"
        style={{ borderColor: toneBorder[tone] }}
      >
        {/* Speech-bubble tail pointing at the mascot */}
        <span
          className="absolute top-1/2 -left-[7px] h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-b border-l bg-card"
          style={{ borderColor: toneBorder[tone] }}
        />
        <p className="relative text-[0.95rem] leading-snug">{text}</p>
      </motion.div>
    </AnimatePresence>
  </div>
);
