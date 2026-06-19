import { useId } from "react";

// Accurate Union Jack (2:1). Unique clip ids per instance so several can render
// on one page without colliding.
export const UnionJack = ({ className }: { className?: string }) => {
  const uid = useId();
  const clip = `uj-${uid}`;

  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden role="img">
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clip})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
};
