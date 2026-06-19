"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpenCheck, Gauge, Target, Timer, Trophy } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { ThemeToggle } from "@/components/theme-toggle";
import { UnionJack } from "@/components/union-jack";
import { ROUTES } from "@/lib/routes";
import { useProgress } from "@/lib/store";

// Deadpan lines for the stoic Queen's Guard — he must not react.
const guardLines = [
  "I must not laugh.",
  "On duty — no smiling.",
  "Eyes front, citizen.",
  "A guard never flinches.",
  "I felt nothing. Carry on.",
  "Steady… steady…",
];

const features = [
  {
    icon: BookOpenCheck,
    title: "Learn every fact",
    body: "99 knowledge items mapped to the official handbook — master the fact, not the answer position.",
  },
  {
    icon: Timer,
    title: "Realistic mock exams",
    body: "24 questions, a 45-minute timer and the real 75% pass mark. No surprises on the day.",
  },
  {
    icon: Gauge,
    title: "Readiness score",
    body: "One honest signal — not ready, almost ready, or likely ready — so you book with confidence.",
  },
  {
    icon: Target,
    title: "Fix your mistakes",
    body: "Weak facts resurface in new wording until they stick. Your misses become tomorrow's wins.",
  },
];

const stats = [
  { value: "150+", label: "Original questions" },
  { value: "10", label: "Topic areas" },
  { value: "24", label: "Question mocks" },
];

const LandingPage = () => {
  const onboarded = useProgress((s) => s.onboarded);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const startHref = hasHydrated && onboarded ? ROUTES.app : ROUTES.onboarding;
  const startLabel =
    hasHydrated && onboarded ? "Continue studying" : "Start free — no sign-up";

  const [poke, setPoke] = useState<{ n: number; line: string } | null>(null);
  const pokeGuard = () =>
    setPoke((p) => ({
      n: (p?.n ?? 0) + 1,
      line: guardLines[Math.floor(Math.random() * guardLines.length)],
    }));
  useEffect(() => {
    if (!poke) return;
    const t = setTimeout(() => setPoke(null), 2000);
    return () => clearTimeout(t);
  }, [poke]);

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <span className="flex items-center gap-2 font-bold tracking-tight">
          <Mascot mood="happy" scale={3} bob={false} />
          Brit Ready
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={startHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-1.5 text-sm font-semibold text-fg transition-colors hover:bg-card-2"
          >
            Open app <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 pt-10 pb-16 text-center md:pt-16">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative"
        >
          <AnimatePresence>
            {poke && (
              <motion.div
                key={poke.n}
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-fg shadow-lg"
              >
                {poke.line}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={pokeGuard}
            aria-label="Poke the guard"
            key={poke?.n ?? "idle"}
            animate={poke ? { rotate: [0, -5, 5, -4, 4, 0], x: [0, -2, 2, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="cursor-pointer"
          >
            <Mascot mood="celebrate" scale={13} bob={!poke} />
          </motion.button>
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-fg"
        >
          <UnionJack className="h-3 w-auto rounded-[2px]" /> Gamified Life in the UK prep
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
        >
          Pass the Life in the UK Test
          <span className="block text-brand">with total confidence.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl text-lg text-muted"
        >
          Turn an overwhelming handbook into a manageable game. Practise original questions,
          sit realistic mocks, and always know exactly when you&apos;re ready.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href={startHref} className="pixel-btn w-full px-7 text-center sm:w-auto">
            {startLabel}
          </Link>
          <a
            href="#how-it-works"
            className="pixel-btn pixel-btn-ghost w-full px-7 text-center sm:w-auto"
          >
            How it works
          </a>
        </motion.div>

        <div className="mt-6 flex items-center gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-fg">{s.value}</div>
              <div className="text-xs text-faint">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-6xl scroll-mt-8 px-5 pb-16"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="pixel-panel flex flex-col gap-3 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold">{f.title}</h3>
                <p className="text-sm text-muted">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto w-full max-w-3xl px-5 pb-20">
        <div className="pixel-panel-raised flex flex-col items-center gap-4 px-6 py-10 text-center">
          <Trophy size={32} className="text-gold" />
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Ready to start your streak?
          </h2>
          <p className="max-w-md text-muted">
            Everything runs in your browser. No account, no payment — your progress stays on
            your device.
          </p>
          <Link href={startHref} className="pixel-btn px-8">
            {startLabel}
          </Link>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-10 text-center text-xs text-faint">
        Independent, non-official preparation tool — not affiliated with GOV.UK or the Home
        Office.{" "}
        <Link href={ROUTES.about} className="underline">
          Read the disclaimer
        </Link>
      </footer>
    </div>
  );
};

export default LandingPage;
