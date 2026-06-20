"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Layers, RotateCcw } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { FactCard } from "@/components/fact-card";
import { PageHeader } from "@/components/page-header";
import { ROUTES } from "@/lib/routes";
import { commonMistakes } from "@/lib/stats";
import { useProgress } from "@/lib/store";
import { useDerived } from "@/lib/use-derived";

const ReviseInner = () => {
  const answers = useProgress((s) => s.answers);
  const mastery = useProgress((s) => s.mastery);
  const { stats, toReview } = useDerived();
  const mistakes = useMemo(() => commonMistakes(answers, 6), [answers]);

  const metrics = [
    { label: "Mastery", value: `${stats.overallMastery}%` },
    { label: "Accuracy", value: `${stats.accuracy}%` },
    { label: "Answered", value: `${stats.totalAnswered}` },
  ];

  return (
    <div className="pb-6">
      <PageHeader
        title="Revise"
        subtitle="See your mistakes, understand them, and come back stronger."
        icon={<Layers size={24} />}
        accent="var(--color-brand)"
      />

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="pixel-panel px-2 py-3 text-center">
            <div className="text-xl font-extrabold text-brand">{m.value}</div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wide text-faint">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <Link
        href={ROUTES.learn("review")}
        className="pixel-panel mt-4 flex items-center gap-3 px-4 py-3.5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
          <RotateCcw size={18} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Spaced review</span>
          <span className="block text-xs text-muted">
            {toReview > 0
              ? `${toReview} fact${toReview > 1 ? "s" : ""} ready to revisit`
              : "Nothing due — check back later"}
          </span>
        </span>
        <ChevronRight size={18} className="text-faint" />
      </Link>

      {mistakes.length > 0 && (
        <section className="pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-danger">
            Your common mistakes
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {mistakes.map((m) => (
              <FactCard
                key={m.item.id}
                item={m.item}
                mastery={mastery[m.item.id]}
                badge={`missed ${m.wrongCount}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
          Revise by section
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {stats.categoryStats.map((stat) => (
            <CategoryCard
              key={stat.categoryId}
              stat={stat}
              href={ROUTES.category(stat.categoryId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const RevisePage = () => <ReviseInner />;

export default RevisePage;
