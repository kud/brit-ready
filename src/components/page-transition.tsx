"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

// Re-keying by pathname replays the enter animation on every navigation —
// a neat, reliable transition that avoids App Router exit-animation pitfalls.
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
