import Link from "next/link";

const NotFound = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-5 text-center">
    <p className="font-display text-6xl font-extrabold text-brand">404</p>
    <h1 className="text-2xl font-bold">This page wandered off the parade route.</h1>
    <p className="max-w-sm text-muted">
      The guard looked twice — there&apos;s nothing stationed here. Let&apos;s march you
      back to somewhere useful.
    </p>
    <Link href="/" className="pixel-btn px-8">
      Back to safety
    </Link>
  </div>
);

export default NotFound;
