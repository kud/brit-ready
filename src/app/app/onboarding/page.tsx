"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { DateField } from "@/components/date-field";
import { Mascot } from "@/components/mascot";
import { ROUTES } from "@/lib/routes";
import { useProgress } from "@/lib/store";

const OnboardingInner = () => {
  const router = useRouter();
  const completeOnboarding = useProgress((s) => s.completeOnboarding);
  const setUserName = useProgress((s) => s.setUserName);
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const start = (destination: string) => {
    if (name.trim()) setUserName(name);
    completeOnboarding(targetDate || undefined);
    router.push(destination);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-10 pb-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Mascot mood="happy" scale={11} />
        <h1 className="text-3xl font-extrabold tracking-tight">Brit Ready</h1>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Know when you&apos;re ready
        </p>
      </div>

      <p className="text-center text-muted">
        Master every fact in the Life in the UK handbook through quick quizzes, realistic
        mock exams, and a readiness score that tells you when to book the real test.
      </p>

      <div className="pixel-panel px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
          Please note
        </p>
        <p className="text-sm leading-relaxed text-muted">
          This is an independent, <strong>non-official</strong> preparation tool. It is not
          affiliated with or endorsed by GOV.UK, the Home Office or any official provider.
          All questions are original practice questions — not real exam questions — and
          passing here does not guarantee passing the official test.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-faint">
            Your name (optional)
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sam"
            maxLength={24}
            className="rounded-xl border border-border bg-card-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-faint">
            Test date (optional)
          </span>
          <DateField value={targetDate} onChange={setTargetDate} aria-label="Test date" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => start(ROUTES.learn("diagnostic"))}
          className="pixel-btn flex w-full items-center justify-center gap-2"
        >
          <Play size={18} fill="currentColor" /> Take a diagnostic
        </button>
        <button
          onClick={() => start(ROUTES.app)}
          className="pixel-btn pixel-btn-ghost w-full"
        >
          Explore first
        </button>
      </div>
    </div>
  );
};

const OnboardingPage = () => <OnboardingInner />;

export default OnboardingPage;
