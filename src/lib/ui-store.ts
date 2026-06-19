import { create } from "zustand";

// Ephemeral UI state (not persisted) — e.g. the settings bottom sheet.
interface UIState {
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useUI = create<UIState>((set) => ({
  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
}));
