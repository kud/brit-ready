"use client";

import { useEffect } from "react";
import { runReminders } from "@/lib/notifications";
import { useProgress } from "@/lib/store";

/** Fires opt-in reminders once the app has loaded (and hydrated). */
export const NotificationManager = () => {
  const hasHydrated = useProgress((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated) runReminders();
  }, [hasHydrated]);

  return null;
};
