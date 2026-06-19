"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, ExternalLink, Layers, Play, Settings, Timer } from "lucide-react";
import { CoachBubble } from "@/components/coach-bubble";
import { HydrationGate } from "@/components/hydration-gate";
import { Icon } from "@/components/icon";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { coachGreeting } from "@/lib/coach";
import { levelFromXp } from "@/lib/gamification";
import { ROUTES } from "@/lib/routes";
import { useProgress } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { useDerived } from "@/lib/use-derived";

const daysUntil = (iso: string) =>
  Math.ceil((new Date(`${iso}T00:00:00`).getTime() - Date.now()) / (24 * 60 * 60 * 1000));

const recommendedAction = (toReview: number, hasMock: boolean) => {
  if (toReview > 0)
    return {
      href: ROUTES.learn("review"),
      label: `Review ${toReview} weak fact${toReview > 1 ? "s" : ""}`,
    };
  if (!hasMock) return { href: ROUTES.mock, label: "Try your first mock exam" };
  return { href: ROUTES.learn("mixed"), label: "Mixed practice" };
};

const DashboardInner = () => {
  const router = useRouter();
  const onboarded = useProgress((s) => s.onboarded);
  const userName = useProgress((s) => s.userName);
  const targetTestDate = useProgress((s) => s.targetTestDate);
  const openSettings = useUI((s) => s.openSettings);
  const { readiness, stats, level, xp, streakCount, toReview } = useDerived();

  useEffect(() => {
    if (!onboarded) router.replace(ROUTES.onboarding);
  }, [onboarded, router]);

  if (!onboarded) return null;

  const action = recommendedAction(toReview, stats.mockAttempts.length > 0);
  const levelInfo = levelFromXp(xp);
  const weakest = [...stats.categoryStats]
    .filter((c) => c.seen > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);
  const countdown = targetTestDate ? daysUntil(targetTestDate) : null;
  const greeting = coachGreeting({
    streakCount,
    toReview,
    readinessScore: readiness.score,
    hasMock: stats.mockAttempts.length > 0,
    totalAnswered: stats.totalAnswered,
  });

  return (
    <div className="relative flex flex-col gap-8 pt-8">
      {/* Warm ambience unique to the home — a friendlier feel than the rest.
          Full-viewport fixed layer (behind content) so it never seams at the
          centred column's edges. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 42% at 50% -5%, color-mix(in srgb, var(--color-gold) 11%, transparent), transparent 70%)",
        }}
      />
      <header className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-faint">Welcome back</p>
            <h1 className="mt-1 text-4xl font-extrabold leading-none tracking-tight md:text-5xl">
              Hey {userName ? userName : "there"}
            </h1>
          </div>
          <button
            onClick={openSettings}
            aria-label="Settings"
            className="rounded-lg p-1.5 text-faint transition-colors hover:bg-card-2 hover:text-fg md:hidden"
          >
            <Settings size={22} />
          </button>
        </div>

        <CoachBubble mood={greeting.mood} text={greeting.text} />
      </header>

      {/* Curated key stats — not everything, just the headline numbers. */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Level", value: `${level.level}`, color: "var(--color-gold)" },
          { label: "Day streak", value: `${streakCount}`, color: "var(--color-primary)" },
          {
            label: "Best mock",
            value: stats.bestMockScore !== null ? `${stats.bestMockScore}/24` : "—",
            color: "var(--color-brand)",
          },
        ].map((s) => (
          <div key={s.label} className="pixel-panel px-2 py-4 text-center">
            <div
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wide text-faint">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="pixel-panel flex flex-col items-center gap-6 px-6 py-9 lg:col-span-2">
          <ReadinessGauge score={readiness.score} label={readiness.label} />
          <ul className="w-full max-w-md space-y-2">
            {readiness.reasons.slice(0, 2).map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="text-brand">›</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <Link
            href={action.href}
            className="pixel-btn flex w-full max-w-sm items-center justify-center gap-2"
          >
            <Play size={18} fill="currentColor" /> {action.label}
          </Link>
        </section>

        <aside className="flex flex-col gap-4">
          {countdown !== null && (
            <div className="pixel-panel flex items-center gap-3 px-4 py-3">
              <CalendarDays size={20} className="text-accent" />
              <span className="text-sm text-muted">
                {countdown > 0
                  ? `${countdown} day${countdown > 1 ? "s" : ""} until your test`
                  : "Test day has arrived — good luck!"}
              </span>
            </div>
          )}

          <div className="pixel-panel px-4 py-4">
            <div className="mb-1.5 flex justify-between text-xs text-faint">
              <span>Level {level.level}</span>
              <span>
                {levelInfo.xpIntoLevel}/{levelInfo.xpForLevel} XP
              </span>
            </div>
            <div className="pixel-bar">
              <span style={{ width: `${levelInfo.progress * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.mock}
              className="pixel-panel flex flex-col items-center gap-2 px-3 py-4 text-center transition-transform active:translate-y-[1px]"
            >
              <Timer size={22} className="text-accent" />
              <span className="text-sm font-semibold">Mock exam</span>
            </Link>
            <Link
              href={ROUTES.revise}
              className="pixel-panel flex flex-col items-center gap-2 px-3 py-4 text-center transition-transform active:translate-y-[1px]"
            >
              <Layers size={22} className="text-brand" />
              <span className="text-sm font-semibold">Revise</span>
            </Link>
          </div>
        </aside>
      </div>

      <a
        href="https://www.gov.uk/life-in-the-uk-test"
        target="_blank"
        rel="noopener noreferrer"
        className="pixel-panel flex items-center gap-3 px-4 py-3.5 transition-transform active:translate-y-[1px]"
      >
        <span className="flex-1">
          <span className="block text-sm font-semibold">Book the official test</span>
          <span className="block text-xs text-faint">Opens GOV.UK in a new tab</span>
        </span>
        <ExternalLink size={18} className="shrink-0 text-faint" />
      </a>

      {weakest.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
            Focus areas
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {weakest.map((c) => (
              <Link
                key={c.categoryId}
                href={ROUTES.category(c.categoryId)}
                className="pixel-panel flex items-center gap-3 px-3 py-2.5"
              >
                <Icon name={c.icon} size={20} className="text-accent" />
                <span className="flex-1 text-sm">{c.title}</span>
                <span className="text-sm font-bold text-gold">{c.score}%</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const DashboardPage = () => (
  <HydrationGate>
    <DashboardInner />
  </HydrationGate>
);

export default DashboardPage;
