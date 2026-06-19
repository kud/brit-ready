"use client";

import { useId } from "react";
import { useProgress } from "@/lib/store";
import { PixelSprite } from "./pixel-sprite";

export type MascotMood = "happy" | "celebrate" | "think" | "encourage";

// ── Pixel-art guard (matches the app icon) ──────────────────────────────
const pixelPalette: Record<string, string> = {
  H: "#2c3040", // bearskin (near-black)
  h: "#1d2130",
  S: "#eab78d", // skin
  s: "#cf9468",
  E: "#2b3346", // eyes
  R: "#d23b3b", // tunic
  G: "#e3b552", // gold
  P: "#5a6a8c", // trousers
  p: "#46546f",
  B: "#2b3346", // boots
  W: "#9aa0ad", // rifle
};

const pixelRows = [
  "................",
  ".....HHHHHH.....",
  "...W.HHHHHH.....",
  "...W.HHHHHH.....",
  "...WhHHHHHh.....",
  "...W.HHHHHH.....",
  "...WhHHHHHh.....",
  "...W..SSSS......",
  "...W..SEES......",
  "...W..sSSs......",
  "...W.RRRRRR.....",
  "...WRRRRRRRR....",
  "...WRGRRRRGR....",
  "...WRRGGGGRR....",
  "...WRGRRRRGR....",
  "...WRRRRRRRR....",
  "....GGGGGGGG....",
  "....PPPPPPPP....",
  ".....PP..PP.....",
  ".....PP..PP.....",
  ".....pP..Pp.....",
  ".....BB..BB.....",
  "....BBB..BBB....",
  "................",
];

const PixelGuard = ({ scale }: { scale: number }) => (
  <PixelSprite
    rows={pixelRows}
    palette={pixelPalette}
    scale={Math.max(2, Math.round(scale / 2.4))}
    title="Brit Ready guard"
  />
);

// ── Soft illustrated guard (the friendly alternative) ───────────────────
const mouths: Record<MascotMood, React.ReactNode> = {
  happy: <path d="M41 68 Q50 76 59 68" />,
  celebrate: <path d="M40 66 Q50 80 60 66 Z" fill="#9a2740" stroke="none" />,
  think: <path d="M45 70 h10" />,
  encourage: <path d="M41 69 Q50 74 59 69" />,
};
const eyeShift: Record<MascotMood, { dx: number; dy: number }> = {
  happy: { dx: 0, dy: 0 },
  celebrate: { dx: 0, dy: -0.5 },
  think: { dx: 1.6, dy: -1.4 },
  encourage: { dx: 0, dy: 0.8 },
};

const SoftGuard = ({ mood, scale }: { mood: MascotMood; scale: number }) => {
  const size = Math.round(scale * 8);
  const { dx, dy } = eyeShift[mood];
  const uid = useId();
  const faceId = `face-${uid}`;
  const hatId = `hat-${uid}`;
  const collarId = `collar-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Brit Ready guard"
    >
      <defs>
        <linearGradient id={faceId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9b0" />
          <stop offset="1" stopColor="#f2bd8b" />
        </linearGradient>
        <linearGradient id={hatId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3040" />
          <stop offset="1" stopColor="#15192a" />
        </linearGradient>
        <linearGradient id={collarId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4d5a" />
          <stop offset="1" stopColor="#cf2f3d" />
        </linearGradient>
      </defs>
      <path d="M24 100 V90 Q24 80 50 80 Q76 80 76 90 V100 Z" fill={`url(#${collarId})`} />
      <circle cx="50" cy="92" r="2.4" fill="#ffce4d" />
      <rect x="20" y="34" width="60" height="54" rx="27" fill={`url(#${faceId})`} />
      <path
        d="M24 44 Q24 12 50 12 Q76 12 76 44 Q76 50 50 50 Q24 50 24 44 Z"
        fill={`url(#${hatId})`}
      />
      <circle cx="31" cy="64" r="4.5" fill="#f6a09b" opacity="0.5" />
      <circle cx="69" cy="64" r="4.5" fill="#f6a09b" opacity="0.5" />
      <circle cx="40" cy="56" r="7.5" fill="#fff" />
      <circle cx="60" cy="56" r="7.5" fill="#fff" />
      <circle cx={40 + dx} cy={56 + dy} r="3.6" fill="#1b2233" />
      <circle cx={60 + dx} cy={56 + dy} r="3.6" fill="#1b2233" />
      <circle cx={41.2 + dx} cy={54.6 + dy} r="1.2" fill="#fff" />
      <circle cx={61.2 + dx} cy={54.6 + dy} r="1.2" fill="#fff" />
      <g stroke="#9a2740" strokeWidth="2.6" fill="none" strokeLinecap="round">
        {mouths[mood]}
      </g>
    </svg>
  );
};

export interface MascotProps {
  mood?: MascotMood;
  scale?: number;
  bob?: boolean;
  className?: string;
}

export const Mascot = ({
  mood = "happy",
  scale = 8,
  bob = true,
  className,
}: MascotProps) => {
  const style = useProgress((s) => s.mascotStyle);
  return (
    <div
      className={`${bob ? "animate-bob" : ""} ${className ?? ""}`}
      style={{ filter: "drop-shadow(0 4px 7px rgba(2,6,23,0.32))" }}
    >
      {style === "soft" ? (
        <SoftGuard mood={mood} scale={scale} />
      ) : (
        <PixelGuard scale={scale} />
      )}
    </div>
  );
};
