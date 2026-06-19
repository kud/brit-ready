export const PageHeader = ({
  title,
  subtitle,
  icon,
  accent = "var(--color-accent)",
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** CSS colour used to tint the hero icon — distinguishes each screen. */
  accent?: string;
  action?: React.ReactNode;
}) => (
  <header className="relative pt-8 pb-6 md:pt-10">
    {/* Subtle accent glow tied to the screen. */}
    {icon && (
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 left-0 h-36 w-48 rounded-full opacity-50 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
    )}
    <div className="relative flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`,
                color: accent,
              }}
            >
              {icon}
            </span>
          )}
          <h1 className="text-4xl font-extrabold leading-none tracking-tight md:text-5xl">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  </header>
);
