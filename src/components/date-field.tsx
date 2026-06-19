"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Cached "today" so render stays pure (no direct Date.now / argless new Date).
let cachedToday = 0;
const todayMs = () => {
  if (!cachedToday) cachedToday = Date.now();
  return cachedToday;
};

const pad = (n: number) => `${n}`.padStart(2, "0");
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const formatLong = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
}

export const DateField = ({
  value,
  onChange,
  placeholder = "Choose a date",
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const base = value ? new Date(`${value}T00:00:00`) : new Date(todayMs());
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() });

  const now = new Date(todayMs());
  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());
  // No dates in the past — a test date is always today or later.
  const atFirstMonth = view.y * 12 + view.m <= now.getFullYear() * 12 + now.getMonth();

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday-first
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shift = (delta: number) =>
    setView((v) => {
      const total = v.y * 12 + v.m + delta;
      return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
    });

  const select = (d: number) => {
    onChange(toISO(view.y, view.m, d));
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card-2 px-3 py-2.5 text-left text-sm transition-colors hover:border-accent"
        >
          <CalendarIcon size={16} className="text-accent" />
          <span className={value ? "text-fg" : "text-faint"}>
            {value ? formatLong(value) : placeholder}
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear date"
            className="flex items-center justify-center rounded-xl border border-border bg-card-2 px-3 text-faint hover:text-fg"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <>
          {/* Click-outside backdrop */}
          <button
            type="button"
            aria-label="Close calendar"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          {/* Floating popover — overlays content instead of pushing it down */}
          <div className="pixel-panel pixel-panel-raised absolute left-0 right-0 top-full z-20 mt-2 p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shift(-1)}
                disabled={atFirstMonth}
                aria-label="Previous month"
                className="rounded-lg p-1.5 text-muted hover:bg-card-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold">
                {MONTHS[view.m]} {view.y}
              </span>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="rounded-lg p-1.5 text-muted hover:bg-card-2 hover:text-fg"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w) => (
                <span
                  key={w}
                  className="py-1 text-center text-[0.65rem] font-medium text-faint"
                >
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (d === null) return <span key={i} />;
                const iso = toISO(view.y, view.m, d);
                const selected = value === iso;
                const isToday = todayISO === iso;
                const isPast = iso < todayISO;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isPast}
                    onClick={() => select(d)}
                    aria-pressed={selected}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                      selected
                        ? "bg-primary font-bold text-ink"
                        : "hover:bg-card-2 hover:text-fg",
                      !selected && isToday && "ring-1 ring-accent",
                      !selected && "text-muted",
                      isPast && "cursor-not-allowed opacity-25 hover:bg-transparent",
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
