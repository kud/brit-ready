"use client";

import { useMediaQuery } from "@/lib/use-media-query";
import { useUI } from "@/lib/ui-store";
import { BottomSheet } from "./bottom-sheet";
import { Modal } from "./modal";
import { SettingsContent } from "./settings-content";

// Bottom sheet on mobile, centered modal on desktop.
export const SettingsSheet = () => {
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Container = isDesktop ? Modal : BottomSheet;

  return (
    <Container open={open} onClose={close} title="Settings">
      <SettingsContent />
    </Container>
  );
};
