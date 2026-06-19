// Tactile + visual feedback helpers. All guarded so they no-op safely on
// devices without support and during server rendering.

export const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore — vibration is a progressive enhancement
    }
  }
};

export const hapticCorrect = () => haptic(18);
export const hapticWrong = () => haptic([0, 40, 30, 40]);

export const celebrate = async (intensity: "small" | "big" = "small") => {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#46d39a", "#ffce4d", "#5b8cff", "#ff5d6c"];
  if (intensity === "big") {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors, scalar: 0.9 });
    setTimeout(
      () =>
        confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0 }, colors }),
      150,
    );
    setTimeout(
      () =>
        confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1 }, colors }),
      300,
    );
  } else {
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 }, colors, scalar: 0.8 });
  }
};
