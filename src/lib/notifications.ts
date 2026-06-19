import { dayKey } from "./gamification";
import { useProgress } from "./store";

// Local-first reminders. A PWA can't reliably schedule background pushes without
// a server, so these fire when the app is opened (at most once per day).

const LAST_NOTIFIED_KEY = "brit-ready-last-notified";

export const notificationsSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!notificationsSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
};

const daysUntil = (iso: string) =>
  Math.ceil((new Date(`${iso}T00:00:00`).getTime() - Date.now()) / 86_400_000);

/** Shows at most one reminder per calendar day, when the app is opened. */
export const runReminders = () => {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  const state = useProgress.getState();
  if (!state.remindersEnabled) return;

  const today = dayKey(Date.now());
  if (localStorage.getItem(LAST_NOTIFIED_KEY) === today) return;

  let title = "";
  let body = "";
  const practisedToday = state.lastPracticeDay === today;

  if (state.targetTestDate) {
    const days = daysUntil(state.targetTestDate);
    if (days >= 0) {
      title = `${days} day${days === 1 ? "" : "s"} until your Life in the UK test`;
      body = practisedToday
        ? "Great work today — keep the momentum going."
        : "A short practice session keeps you on track.";
    }
  }

  if (!title && !practisedToday) {
    title = "Time for today's practice";
    body = "Keep your streak alive with a quick session.";
  }

  if (!title) return;

  try {
    new Notification(title, { body, icon: "/icons/icon-192.png" });
    localStorage.setItem(LAST_NOTIFIED_KEY, today);
  } catch {
    // ignore — notifications are a progressive enhancement
  }
};
