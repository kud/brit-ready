"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
    {/* reducedMotion="user" makes every Motion component honour the OS setting. */}
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </NextThemesProvider>
);
