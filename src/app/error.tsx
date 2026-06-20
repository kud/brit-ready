"use client";

import { useEffect } from "react";
import Link from "next/link";

// Route-level error boundary. Deliberately self-contained — it must not import
// the store or anything that could be the source of the failure it is catching.
const ErrorBoundary = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="font-display text-5xl font-extrabold text-danger">Oops</p>
      <h1 className="text-2xl font-bold">Something went sideways.</h1>
      <p className="max-w-sm text-muted">
        A hiccup on our end — your progress is saved safely on this device. Give it another
        go and you should be back on track.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => unstable_retry()} className="pixel-btn px-8">
          Try again
        </button>
        <Link href="/" className="pixel-btn pixel-btn-ghost px-8">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
