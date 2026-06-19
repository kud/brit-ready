"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({
  className,
  withLabel = false,
}: {
  className?: string;
  withLabel?: boolean;
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Before mount the resolved theme is unknown on the server, so keep the label
  // stable until mounted to avoid a hydration mismatch.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card-2 px-3 py-2 text-sm text-muted transition-colors hover:text-fg",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )
      ) : (
        <span className="inline-block h-[18px] w-[18px]" />
      )}
      {withLabel && (
        <span>{mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}</span>
      )}
    </button>
  );
};
