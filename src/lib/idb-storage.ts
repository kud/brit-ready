import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

// Zustand persist adapter backed by IndexedDB (via idb-keyval). IndexedDB holds
// far more than localStorage and keeps all progress on-device — no backend.
export const idbStorage: StateStorage = {
  getItem: async (name) => (await get(name)) ?? null,
  setItem: async (name, value) => {
    await set(name, value);
  },
  removeItem: async (name) => {
    await del(name);
  },
};
