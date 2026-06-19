"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";
import { categoryById } from "@/content/categories";
import { knowledgeItems } from "@/content/knowledge-items";
import { FactCard } from "@/components/fact-card";
import { HydrationGate } from "@/components/hydration-gate";
import { Icon } from "@/components/icon";
import { isWeak } from "@/lib/mastery";
import { ROUTES } from "@/lib/routes";
import { useProgress } from "@/lib/store";
import type { CategoryId } from "@/lib/types";

const CategoryInner = ({ id }: { id: CategoryId }) => {
  const category = categoryById[id];
  const mastery = useProgress((s) => s.mastery);

  const items = useMemo(() => {
    const inCategory = knowledgeItems.filter((k) => k.categoryId === id);
    // Weak and unseen facts first — those are what you came to revise.
    return [...inCategory].sort((a, b) => {
      const aw = isWeak(mastery[a.id]) ? 0 : 1;
      const bw = isWeak(mastery[b.id]) ? 0 : 1;
      return aw - bw;
    });
  }, [id, mastery]);

  const seen = items.filter((k) => mastery[k.id]?.seen).length;
  const score = Math.round(
    items.reduce((sum, k) => sum + (mastery[k.id]?.masteryScore ?? 0), 0) / items.length,
  );

  return (
    <div className="pb-6">
      <header className="pt-7 pb-4">
        <Link
          href={ROUTES.revise}
          className="inline-flex items-center gap-1 text-sm text-faint hover:text-muted"
        >
          <ChevronLeft size={16} /> Revise
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Icon name={category.icon} size={26} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold leading-tight tracking-tight">
              {category.title}
            </h1>
            <p className="mt-0.5 text-sm text-muted">{category.blurb}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="pixel-bar flex-1">
            <span style={{ width: `${score}%` }} />
          </div>
          <span className="text-sm font-bold text-gold">{score}%</span>
        </div>
        <p className="mt-1 text-xs text-faint">
          {seen}/{items.length} facts practised
        </p>
      </header>

      <Link
        href={ROUTES.learn("topic", id)}
        className="pixel-btn mb-5 flex w-full items-center justify-center gap-2"
      >
        <Play size={18} fill="currentColor" /> Practise this section
      </Link>

      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <FactCard key={item.id} item={item} mastery={mastery[item.id]} />
        ))}
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  if (!(id in categoryById)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted">That section doesn&apos;t exist.</p>
        <Link href="/app/revise" className="pixel-btn pixel-corners">
          Back to Revise
        </Link>
      </div>
    );
  }
  return (
    <HydrationGate>
      <CategoryInner id={id as CategoryId} />
    </HydrationGate>
  );
};

export default CategoryPage;
