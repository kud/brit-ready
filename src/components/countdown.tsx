"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { soundCorrect, soundTap } from "@/lib/sound";

// One real second per numeral so the cadence reads as 3·2·1.
const TICK_MS = 1000;
const GO_HOLD_MS = 600;

// Motivating 3·2·1·Go before a session starts. Tap anywhere to skip.
export const Countdown = ({ onDone }: { onDone: () => void }) => {
  const [n, setN] = useState(3);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (n <= 0) {
      soundCorrect();
      const t = setTimeout(() => onDoneRef.current(), GO_HOLD_MS);
      return () => clearTimeout(t);
    }
    soundTap();
    const t = setTimeout(() => setN((v) => v - 1), TICK_MS);
    return () => clearTimeout(t);
  }, [n]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center"
      style={{ background: "var(--color-bg)" }}
      aria-label="Starting soon"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={n}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          // Snappy spring that settles well within TICK_MS, so the exit+enter
          // cycle never lags behind the once-a-second state tick.
          transition={{
            scale: { type: "spring", stiffness: 520, damping: 24 },
            opacity: { duration: 0.14 },
          }}
          className="font-extrabold leading-none tracking-tight"
          style={{
            fontSize: n <= 0 ? "4rem" : "7rem",
            color: n <= 0 ? "var(--color-brand)" : "var(--color-fg)",
          }}
        >
          {n <= 0 ? "Go!" : n}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
