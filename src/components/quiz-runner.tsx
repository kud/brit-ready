"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Flame, X } from "lucide-react";
import { coachOnAnswer, type CoachLine } from "@/lib/coach";
import { celebrate, hapticCorrect, hapticWrong } from "@/lib/feedback";
import { soundCorrect, soundTap, soundWrong } from "@/lib/sound";
import { labelForScore } from "@/lib/readiness";
import { cn } from "@/lib/utils";
import {
  useProgress,
  type CommitOutcome,
  type SessionItemResult,
  type SessionResult,
} from "@/lib/store";
import type { AttemptMode, AnswerOption, CategoryId, Question } from "@/lib/types";
import { CoachBubble } from "./coach-bubble";
import { Countdown } from "./countdown";
import { ResultScreen } from "./result-screen";

const shuffle = <T,>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const formatTime = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = `${total % 60}`.padStart(2, "0");
  return `${m}:${s}`;
};

// Graduated urgency: amber under 5 min, red under 1 min, big red under 10 s.
const timerClass = (ms: number) => {
  if (ms <= 10_000) return "text-base text-danger";
  if (ms <= 60_000) return "text-danger";
  if (ms <= 300_000) return "text-gold";
  return "text-muted";
};

// Top-to-bottom reveal: the question fades in first, then the options stagger
// in just after — quick, not laggy.
const revealVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
} as const;

export interface QuizRunnerProps {
  questions: Question[];
  mode: AttemptMode;
  categoryId?: CategoryId;
  reviewQuestionIds: string[];
  durationMs?: number;
  title: string;
  onPlayAgain?: () => void;
  onExit: () => void;
}

export const QuizRunner = ({
  questions,
  mode,
  categoryId,
  reviewQuestionIds,
  durationMs,
  title,
  onPlayAgain,
  onExit,
}: QuizRunnerProps) => {
  const commitSession = useProgress((s) => s.commitSession);
  const immediate = mode !== "mock_exam";

  const optionsByQuestion = useMemo(() => {
    const map = new Map<string, AnswerOption[]>();
    questions.forEach((q) => map.set(q.id, shuffle(q.options)));
    return map;
  }, [questions]);

  const startedAt = useRef<number | null>(null);
  const results = useRef<SessionItemResult[]>([]);
  const finished = useRef(false);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [combo, setCombo] = useState(0);
  const [coach, setCoach] = useState<CoachLine | null>(null);
  const [outcome, setOutcome] = useState<CommitOutcome | null>(null);
  const [finishedItems, setFinishedItems] = useState<SessionItemResult[]>([]);
  const [counting, setCounting] = useState(true);
  const [timeLeft, setTimeLeft] = useState(durationMs ?? 0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const options = optionsByQuestion.get(question.id) ?? question.options;

  // The mock timer reads the latest selection and question at expiry without
  // listing them as effect deps — otherwise every tap would restart the tick.
  const selectedIdRef = useRef(selectedId);
  const questionRef = useRef(question);
  useEffect(() => {
    selectedIdRef.current = selectedId;
    questionRef.current = question;
  }, [selectedId, question]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const items = [...results.current];
    const result: SessionResult = {
      mode,
      categoryId,
      startedAt: startedAt.current ?? Date.now(),
      items,
    };
    const committed = commitSession(result);
    const ratio = committed.total ? committed.score / committed.total : 0;
    if (committed.passed || ratio >= 0.9) celebrate("big");
    else if (ratio >= 0.6) celebrate("small");
    setFinishedItems(items);
    setOutcome(committed);
  }, [categoryId, commitSession, mode]);

  const recordAndAdvance = useCallback(
    (item: SessionItemResult) => {
      results.current.push(item);
      if (isLast) {
        finish();
        return;
      }
      setIndex((i) => i + 1);
      setSelectedId(null);
      setRevealed(false);
      setCoach(null);
    },
    [finish, isLast],
  );

  // Mock-exam timer: paused during the 3·2·1 countdown; when it hits zero,
  // fill any unanswered questions and submit.
  useEffect(() => {
    if (immediate || outcome || counting) return;
    if (timeLeft <= 0) {
      const selected = selectedIdRef.current;
      if (selected) {
        results.current.push(buildItem(questionRef.current, selected, reviewQuestionIds));
      }
      for (let i = results.current.length; i < questions.length; i += 1) {
        results.current.push(buildItem(questions[i], null, reviewQuestionIds));
      }
      finish();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1000), 1000);
    return () => clearTimeout(id);
  }, [immediate, outcome, counting, timeLeft, questions, reviewQuestionIds, finish]);

  const handleSelect = (optionId: string) => {
    if (immediate) {
      if (revealed) return;
      setSelectedId(optionId);
      const isCorrect = question.correctOptionIds.includes(optionId);
      const nextCombo = isCorrect ? combo + 1 : 0;
      setCombo(nextCombo);
      setCoach(coachOnAnswer(isCorrect, nextCombo));
      setRevealed(true);
      if (isCorrect) {
        hapticCorrect();
        soundCorrect();
      } else {
        hapticWrong();
        soundWrong();
      }
    } else {
      setSelectedId(optionId);
      soundTap();
    }
  };

  const handleNext = () => {
    recordAndAdvance(buildItem(question, selectedId, reviewQuestionIds));
  };

  const canAdvance = immediate ? revealed : true;

  // Keyboard shortcuts: 1–4 pick an answer, Enter / Space advances.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (outcome || counting) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Enter" || e.key === " ") {
        if (canAdvance) {
          e.preventDefault();
          handleNext();
        }
        return;
      }
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        handleSelect(options[n - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, revealed, immediate, selectedId, index, canAdvance, outcome, counting]);

  if (outcome) {
    return (
      <ResultScreen
        outcome={outcome}
        mode={mode}
        items={finishedItems}
        readinessLabel={labelForScore(outcome.readinessAfter)}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  // Until the 3·2·1 finishes, show only the countdown — no question, progress or timer.
  if (counting) {
    return <Countdown onDone={() => setCounting(false)} />;
  }

  const progress = ((index + (revealed ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="flex flex-col pt-5 pb-6">
      {/* Top bar: exit, progress, timer/combo */}
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="-m-2 flex shrink-0 items-center p-2 text-faint transition-colors hover:text-fg"
          aria-label="Exit session"
        >
          <X size={22} />
        </button>
        <div
          className="pixel-bar flex-1"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-brand-deep), var(--color-brand))",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
        {immediate ? (
          combo >= 2 && (
            <motion.span
              key={combo}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-0.5 text-sm font-bold text-gold"
            >
              <Flame size={16} />
              {combo}
            </motion.span>
          )
        ) : (
          <motion.span
            animate={timeLeft <= 10000 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={
              timeLeft <= 10000 ? { duration: 1, repeat: Infinity } : { duration: 0.2 }
            }
            className={cn("font-mono tabular-nums font-semibold", timerClass(timeLeft))}
          >
            {formatTime(timeLeft)}
          </motion.span>
        )}
      </div>

      <div className="font-display mb-4 text-[0.55rem] uppercase tracking-wide text-faint">
        {title} · {index + 1}/{questions.length}
      </div>

      {/* Fade in top-to-bottom: question first, then options stagger in. */}
      <motion.div
        key={question.id}
        initial="hidden"
        animate="show"
        variants={revealVariants}
      >
        <motion.div variants={itemVariants} className="pixel-panel mb-5 px-4 py-5">
          <h2 className="text-lg leading-snug">{question.prompt}</h2>
        </motion.div>

        <ul className="flex flex-col gap-2.5">
          {options.map((opt, i) => {
            const isChosen = selectedId === opt.id;
            const isCorrectOpt = question.correctOptionIds.includes(opt.id);
            const state = !revealed
              ? isChosen
                ? "chosen"
                : "idle"
              : isCorrectOpt
                ? "correct"
                : isChosen
                  ? "wrong"
                  : "muted";
            return (
              <motion.li key={opt.id} variants={itemVariants}>
                <button
                  onClick={() => handleSelect(opt.id)}
                  disabled={revealed}
                  aria-pressed={isChosen}
                  className={cn(
                    "pixel-panel flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                    optionClass(state),
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-sm font-semibold">
                    {revealed && (isCorrectOpt || isChosen) ? (
                      markFor(state)
                    ) : (
                      <kbd className="hidden sm:inline">{i + 1}</kbd>
                    )}
                  </span>
                  <span className="flex-1 text-[0.95rem]">{opt.text}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        {immediate && revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="mt-5 flex flex-col gap-4"
          >
            {coach && (
              <CoachBubble
                mood={coach.mood}
                text={coach.text}
                tone={
                  question.correctOptionIds.includes(selectedId ?? "") ? "correct" : "wrong"
                }
              />
            )}
            <div className="pixel-panel px-3 py-3">
              <p className="font-display mb-1 text-[0.55rem] uppercase text-accent">Why</p>
              <p className="text-sm text-muted">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-6">
        <button
          className="pixel-btn flex w-full items-center justify-center gap-2"
          onClick={handleNext}
          disabled={immediate && !revealed}
        >
          {immediate
            ? isLast
              ? "Finish"
              : "Next"
            : isLast
              ? "Finish exam"
              : selectedId
                ? "Next"
                : "Skip"}
          {canAdvance && (
            <kbd className="hidden border-black/20 bg-black/10 text-ink/70 md:inline-flex">
              ⏎
            </kbd>
          )}
        </button>
      </div>
    </div>
  );
};

const buildItem = (
  question: Question,
  selectedId: string | null,
  reviewQuestionIds: string[],
): SessionItemResult => ({
  question,
  selectedOptionIds: selectedId ? [selectedId] : [],
  isCorrect: selectedId ? question.correctOptionIds.includes(selectedId) : false,
  wasReview: reviewQuestionIds.includes(question.id),
});

const optionClass = (state: string) => {
  switch (state) {
    case "chosen":
      return "border-accent bg-accent/15 text-fg";
    case "correct":
      return "border-brand bg-brand/15 text-fg";
    case "wrong":
      return "border-danger bg-danger/15 text-fg animate-shake";
    case "muted":
      return "opacity-45";
    default:
      return "hover:border-border-strong hover:bg-card-2";
  }
};

const markFor = (state: string) => {
  if (state === "correct") return <Check size={18} className="text-brand" />;
  if (state === "wrong") return <X size={18} className="text-danger" />;
  return null;
};
