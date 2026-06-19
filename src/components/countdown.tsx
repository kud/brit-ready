"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { soundCorrect, soundTap } from "@/lib/sound";

// Motivating 3·2·1·Go before a session starts. Tap anywhere to skip.
export const Countdown = ({ onDone }: { onDone: () => void }) => {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (n <= 0) {
      soundCorrect();
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    soundTap();
    const t = setTimeout(() => setN((v) => v - 1), 750);
    return () => clearTimeout(t);
  }, [n, onDone]);

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
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
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
