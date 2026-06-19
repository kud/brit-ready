"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Download, Trash2, Upload, Volume2 } from "lucide-react";
import { AboutContent } from "@/components/about-content";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DateField } from "@/components/date-field";
import { KofiButton } from "@/components/kofi-button";
import { ThemeSelector } from "@/components/theme-selector";
import { downloadProgress, importProgress } from "@/lib/data-transfer";
import { notificationsSupported, requestNotificationPermission } from "@/lib/notifications";
import { ROUTES } from "@/lib/routes";
import { soundTap } from "@/lib/sound";
import { useProgress } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-wide text-faint">
      {label}
    </span>
    {children}
  </div>
);

const Switch = ({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40",
      checked ? "bg-brand" : "border border-border bg-card-2",
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
        checked ? "left-[1.4rem]" : "left-0.5",
      )}
    />
  </button>
);

const inputClass =
  "rounded-xl border border-border bg-card-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent";

export const SettingsContent = () => {
  const router = useRouter();
  const closeSettings = useUI((s) => s.closeSettings);
  const userName = useProgress((s) => s.userName);
  const targetTestDate = useProgress((s) => s.targetTestDate);
  const remindersEnabled = useProgress((s) => s.remindersEnabled);
  const soundEnabled = useProgress((s) => s.soundEnabled);
  const mascotStyle = useProgress((s) => s.mascotStyle);
  const setUserName = useProgress((s) => s.setUserName);
  const setTargetDate = useProgress((s) => s.setTargetDate);
  const setReminders = useProgress((s) => s.setReminders);
  const setSound = useProgress((s) => s.setSound);
  const setMascotStyle = useProgress((s) => s.setMascotStyle);
  const resetProgress = useProgress((s) => s.resetProgress);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [view, setView] = useState<"main" | "about">("main");

  const toggleReminders = async (next: boolean) => {
    if (!next) return setReminders(false);
    const granted = await requestNotificationPermission();
    setReminders(granted);
    if (!granted) setNotice("Notifications are blocked in your browser settings.");
  };

  const onImportFile = async (file: File) => {
    const ok = importProgress(await file.text());
    setNotice(ok ? "Progress imported." : "That file isn't a valid Brit Ready backup.");
  };

  const doReset = () => {
    resetProgress();
    closeSettings();
    router.push(ROUTES.landing);
  };

  if (view === "about") {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setView("main")}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={16} /> Settings
        </button>
        <AboutContent />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Section label="Your name">
        <input
          defaultValue={userName ?? ""}
          onBlur={(e) => setUserName(e.target.value)}
          placeholder="e.g. Sam"
          maxLength={24}
          className={inputClass}
        />
      </Section>

      <Section label="Test date">
        <DateField
          value={targetTestDate ?? ""}
          onChange={(v) => setTargetDate(v || undefined)}
          aria-label="Test date"
        />
      </Section>

      <Section label="Theme">
        <ThemeSelector />
      </Section>

      <Section label="Mascot">
        <div
          role="radiogroup"
          aria-label="Mascot style"
          className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-card-2 p-1"
        >
          {(["pixel", "soft"] as const).map((opt) => (
            <button
              key={opt}
              role="radio"
              aria-checked={mascotStyle === opt}
              onClick={() => setMascotStyle(opt)}
              className={cn(
                "rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                mascotStyle === opt
                  ? "bg-card text-fg shadow-sm"
                  : "text-faint hover:text-fg",
              )}
            >
              {opt === "pixel" ? "Pixel art" : "Soft"}
            </button>
          ))}
        </div>
      </Section>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        <div className="flex items-center gap-3">
          <Volume2 size={18} className="text-accent" />
          <div>
            <p className="text-sm font-semibold">Sound effects</p>
            <p className="text-xs text-faint">Subtle blips for answers and wins.</p>
          </div>
        </div>
        <Switch
          checked={soundEnabled}
          onChange={(v) => {
            setSound(v);
            if (v) soundTap();
          }}
          label="Toggle sound effects"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-accent" />
          <div>
            <p className="text-sm font-semibold">Reminders</p>
            <p className="text-xs text-faint">
              Practice nudges, shown when you open the app.
            </p>
          </div>
        </div>
        <Switch
          checked={remindersEnabled}
          onChange={toggleReminders}
          label="Toggle reminders"
          disabled={!notificationsSupported()}
        />
      </div>

      <Section label="Your data">
        <div className="flex gap-3">
          <button
            onClick={downloadProgress}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card-2 px-3 py-2.5 text-sm font-medium hover:bg-card"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card-2 px-3 py-2.5 text-sm font-medium hover:bg-card"
          >
            <Upload size={16} /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </Section>

      {notice && <p className="text-sm text-muted">{notice}</p>}

      <div className="flex flex-col gap-2 border-t border-border pt-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-faint">
          Support
        </span>
        <KofiButton className="w-fit" />
      </div>

      <div className="border-t border-border pt-5">
        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-2 rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          <Trash2 size={16} /> Reset all progress
        </button>
        <p className="mt-2 text-xs text-faint">
          Your data lives only on this device. Resetting cannot be undone.
        </p>
      </div>

      <button
        onClick={() => setView("about")}
        className="text-left text-sm text-muted underline"
      >
        About &amp; disclaimer
      </button>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        message="This permanently erases everything on this device and can't be undone."
        confirmLabel="Reset"
        destructive
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};
