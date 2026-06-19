import Link from "next/link";
import type { CategoryStat } from "@/lib/stats";
import { Icon } from "./icon";

const barColour = (score: number) => {
  if (score >= 70) return "var(--color-brand)";
  if (score >= 40) return "var(--color-gold)";
  if (score > 0) return "var(--color-accent)";
  return "var(--color-faint)";
};

export const CategoryCard = ({ stat, href }: { stat: CategoryStat; href: string }) => (
  <Link
    href={href}
    className="pixel-panel flex h-full flex-col gap-3 px-4 py-4 transition-transform active:translate-y-[2px]"
  >
    <div className="flex items-start gap-2">
      <Icon name={stat.icon} size={20} className="mt-0.5 shrink-0 text-accent" />
      <span className="min-h-[2.4em] flex-1 text-sm font-semibold leading-tight">
        {stat.title}
      </span>
    </div>
    {/* Pinned to the bottom so bars + footers align across a grid row. */}
    <div className="mt-auto flex flex-col gap-1.5 pt-1">
      <div className="pixel-bar" style={{ height: "0.7rem" }}>
        <span
          style={{
            width: `${stat.score}%`,
            backgroundImage: "none",
            backgroundColor: barColour(stat.score),
          }}
        />
      </div>
      <span className="font-mono text-[0.62rem] text-faint">
        {stat.score}% · {stat.seen}/{stat.total}
      </span>
    </div>
  </Link>
);
