import { useProgress } from "./store";

// Subtle synthesized UI sounds — no audio files. Gated by the soundEnabled
// preference and only ever triggered from user gestures (so autoplay-safe).

type Win = Window & { webkitAudioContext?: typeof AudioContext };

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
};

const tone = (
  freq: number,
  durationMs: number,
  type: OscillatorType = "sine",
  gain = 0.05,
  delayMs = 0,
) => {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const start = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  env.gain.setValueAtTime(gain, start);
  env.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + durationMs / 1000);
};

const enabled = () => useProgress.getState().soundEnabled;

export const soundCorrect = () => {
  if (!enabled()) return;
  tone(660, 90, "sine", 0.045);
  tone(880, 120, "sine", 0.045, 70);
};

export const soundWrong = () => {
  if (!enabled()) return;
  tone(196, 170, "sine", 0.05);
};

export const soundTap = () => {
  if (!enabled()) return;
  tone(440, 35, "sine", 0.03);
};

export const soundCelebrate = () => {
  if (!enabled()) return;
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 130, "triangle", 0.045, i * 85));
};
