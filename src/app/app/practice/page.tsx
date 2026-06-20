"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/page-header";
import { ROUTES } from "@/lib/routes";
import { useDerived } from "@/lib/use-derived";

const PracticeInner = () => {
  const { stats, toReview } = useDerived();

  return (
    <div className="pb-6">
      <PageHeader
        title="Practice"
        subtitle="Short sessions, immediate feedback. Learn the fact, not the answer."
        icon={<Play size={24} fill="currentColor" />}
        accent="var(--color-primary)"
      />

      <div className="flex flex-col gap-4">
        <Link
          href={ROUTES.learn("mixed")}
          className="pixel-btn flex w-full items-center justify-center gap-2 py-4"
        >
          <Play size={18} fill="currentColor" /> Mixed practice
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href={ROUTES.learn("review")}
            className="pixel-panel flex flex-col gap-1.5 px-4 py-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-danger">
              Review
            </span>
            <span className="text-sm text-muted">
              {toReview > 0
                ? `${toReview} fact${toReview > 1 ? "s" : ""} due`
                : "All caught up"}
            </span>
          </Link>
          <Link
            href={ROUTES.learn("diagnostic")}
            className="pixel-panel flex flex-col gap-1.5 px-4 py-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Diagnostic
            </span>
            <span className="text-sm text-muted">16 mixed questions</span>
          </Link>
        </div>
      </div>

      <h2 className="pt-10 pb-4 text-xs font-semibold uppercase tracking-wide text-faint">
        Practise by topic
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.categoryStats.map((stat) => (
          <CategoryCard
            key={stat.categoryId}
            stat={stat}
            href={ROUTES.learn("topic", stat.categoryId)}
          />
        ))}
      </div>
    </div>
  );
};

const PracticePage = () => <PracticeInner />;

export default PracticePage;
