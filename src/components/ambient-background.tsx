// Viewport-pinned ambient glow. A real fixed element (not a body background)
// so it never bands — neither the desktop edge-banding of background-attachment
// fixed, nor the mid-page band a scrolling body gradient shows on tall pages.
export const AmbientBackground = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-20"
    style={{
      background:
        "radial-gradient(120% 70% at 50% -10%, var(--glow), transparent 55%), radial-gradient(100% 55% at 50% 112%, color-mix(in srgb, var(--color-brand) 8%, transparent), transparent 55%)",
    }}
  />
);
