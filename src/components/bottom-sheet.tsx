"use client";

import { X } from "lucide-react";
import { Drawer } from "vaul";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Physical bottom sheet (vaul): drag the whole sheet, content scrolls inside,
// and a pull-down at the top hands off to dismissing. Handles scroll-lock,
// Esc and focus automatically.
export const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => (
  <Drawer.Root
    open={open}
    onOpenChange={(next) => {
      if (!next) onClose();
    }}
  >
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl border border-border bg-bg outline-none">
        {/* Pinned header — handle + title stay put while the body scrolls. */}
        <div className="shrink-0 px-5 pt-3">
          <Drawer.Handle className="mx-auto mb-4 !h-1.5 !w-12 !bg-border-strong" />
          <div className="mb-3 flex items-center justify-between">
            <Drawer.Title className="text-2xl font-extrabold tracking-tight">
              {title}
            </Drawer.Title>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-faint transition-colors hover:bg-card-2 hover:text-fg"
            >
              <X size={20} />
            </button>
          </div>
          <Drawer.Description className="sr-only">{title}</Drawer.Description>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);
