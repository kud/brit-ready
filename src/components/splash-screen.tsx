"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mascot } from "./mascot";

const messages = [
  "Hark! Polishing the bearskins…",
  "Pray, a moment whilst we prepare…",
  "Brewing a most splendid cuppa…",
  "By royal decree, loading thy quiz…",
  "Standing to attention, good sir…",
  "Hark, the handbook awaketh…",
];

export const SplashScreen = () => {
  // Stable on the server / first client render (avoids a hydration mismatch),
  // then randomised once mounted on the client.
  const [message, setMessage] = useState(messages[0]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-7 px-8"
      style={{
        background:
          "radial-gradient(70% 60% at 50% 35%, color-mix(in srgb, var(--color-gold) 12%, transparent), transparent 70%), var(--color-bg)",
      }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <Mascot mood="happy" scale={18} />
      </motion.div>

      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Brit Ready</h1>
        <p className="mt-2 text-sm text-muted">{message}</p>
      </div>

      {/* Fake progress fill */}
      <div className="h-1.5 w-44 overflow-hidden rounded-full bg-card-2">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), var(--color-brand))",
          }}
          initial={{ width: "8%" }}
          animate={{ width: "96%" }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};
