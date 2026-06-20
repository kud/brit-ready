"use client";

import Link from "next/link";
import { BarChart3, Flame, Lock } from "lucide-react";
import { badges } from "@/lib/badges";
import { levelFromXp } from "@/lib/gamification";
import { Icon } from "@/components/icon";
import { PageHeader } from "@/components/page-header";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { ROUTES } from "@/lib/routes";
import { useProgress } from "@/lib/store";
import { useDerived } from "@/lib/use-derived";

const formatDate = (ts?: number) =>
  ts ? new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";

const ProgressInner = () => {
  const { stats, readiness, xp, streakCount } = useDerived();
  const unlocked = useProgress((s) => s.unlockedBadgeIds);
  const level = levelFromXp(xp);

  const summary = [
    { label: "Level", value: `${level.level}` },
    { label: "Streak", value: `${streakCount}` },
    {
      label: "Best mock",
      value: stats.bestMockScore !== null ? `${stats.bestMockScore}/24` : "—",
    },
  ];

  return (
    <div className="pb-6">
      <PageHeader
        title="Stats"
        subtitle="Your readiness, mastery and milestones at a glance."
        icon={<BarChart3 size={24} />}
        accent="var(--color-gold)"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="pixel-panel flex flex-col items-center gap-3 px-4 py-5 lg:col-span-1">
          <ReadinessGauge score={readiness.score} label={readiness.label} />
          <ul className="w-full space-y-1.5">
            {readiness.reasons.map((r, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted">
                <span className="text-brand">›</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {summary.map((m) => (
              <div key={m.label} className="pixel-panel px-2 py-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-extrabold text-gold">
                  {m.label === "Streak" && <Flame size={16} />}
                  {m.value}
                </div>
                <div className="mt-1 text-[0.62rem] uppercase tracking-wide text-faint">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
              Category mastery
            </h2>
            <div className="flex flex-col gap-2.5">
              {stats.categoryStats.map((c) => (
                <Link
                  key={c.categoryId}
                  href={ROUTES.category(c.categoryId)}
                  className="flex items-center gap-3"
                >
                  <Icon name={c.icon} size={18} className="text-accent" />
                  <div className="pixel-bar flex-1">
                    <span style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-muted">
                    {c.score}%
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {stats.mockAttempts.length > 0 && (
        <section className="pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
            Mock history
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {stats.mockAttempts.slice(0, 8).map((a) => (
              <div key={a.id} className="pixel-panel flex items-center gap-3 px-3 py-2.5">
                <span className="font-mono font-semibold">
                  {a.score}/{a.totalQuestions}
                </span>
                <span
                  className={`text-xs font-semibold uppercase ${a.passed ? "text-brand" : "text-danger"}`}
                >
                  {a.passed ? "Pass" : "Fail"}
                </span>
                <span className="ml-auto text-xs text-faint">
                  {formatDate(a.completedAt)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
          Badges ({unlocked.length}/{badges.length})
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {badges.map((b) => {
            const has = unlocked.includes(b.id);
            return (
              <div
                key={b.id}
                className={`pixel-panel flex flex-col items-center gap-2 px-2 py-3 text-center ${has ? "" : "opacity-45"}`}
                title={b.description}
              >
                {has ? (
                  <Icon name={b.icon} size={24} className="text-gold" />
                ) : (
                  <Lock size={24} className="text-faint" />
                )}
                <span className="text-[0.65rem] leading-tight">{b.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const ProgressPage = () => <ProgressInner />;

export default ProgressPage;
