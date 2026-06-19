"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useProgress } from "@/lib/store";
import { SplashScreen } from "./splash-screen";

// Module-level so the branded splash only shows once per app launch, not on
// every client-side navigation.
let splashDone = false;

export const HydrationGate = ({ children }: { children: React.ReactNode }) => {
  const hydrated = useProgress((s) => s.hasHydrated);
  const [, force] = useState(0);

  useEffect(() => {
    if (splashDone) return;
    const t = setTimeout(() => {
      splashDone = true;
      force((n) => n + 1);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const ready = hydrated && splashDone;

  return (
    <>
      {ready && children}
      <AnimatePresence>{!ready && <SplashScreen key="splash" />}</AnimatePresence>
    </>
  );
};
