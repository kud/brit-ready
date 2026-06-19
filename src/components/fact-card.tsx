import type { KnowledgeItem, UserMastery } from "@/lib/types";
import { isWeak } from "@/lib/mastery";

const statusOf = (mastery: UserMastery | undefined) => {
  if (!mastery?.seen) return { label: "New", colour: "var(--color-faint)" };
  if (isWeak(mastery)) return { label: "Weak", colour: "var(--color-danger)" };
  return { label: "Strong", colour: "var(--color-brand)" };
};

export interface FactCardProps {
  item: KnowledgeItem;
  mastery?: UserMastery;
  badge?: string;
}

export const FactCard = ({ item, mastery, badge }: FactCardProps) => {
  const status = statusOf(mastery);
  return (
    <div className="pixel-panel px-3 py-3">
      <div className="mb-1 flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5"
          style={{ backgroundColor: status.colour }}
          aria-hidden
        />
        <span className="flex-1 text-sm font-semibold leading-tight">{item.title}</span>
        {badge ? (
          <span className="font-mono text-[0.5rem] uppercase text-danger">{badge}</span>
        ) : (
          <span
            className="font-mono text-[0.5rem] uppercase"
            style={{ color: status.colour }}
          >
            {status.label}
          </span>
        )}
      </div>
      <p className="text-sm text-muted">{item.fact}</p>
    </div>
  );
};
