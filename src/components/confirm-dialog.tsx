"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        />
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-bg p-5 shadow-2xl"
        >
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border border-border bg-card-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-card"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                destructive
                  ? "bg-danger text-white hover:brightness-95"
                  : "bg-primary text-ink hover:bg-primary-deep",
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
