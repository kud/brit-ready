"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself. It replaces the layout, so
// globals.css is not applied — everything here is inline and dependency-free.
const GlobalError = ({
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
    <html lang="en">
      <title>Something went wrong · Brit Ready</title>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.25rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0a1228",
          color: "#f4f6fb",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: "24rem", color: "#9aa0ad" }}>
          The app hit an unexpected error. Your saved progress is untouched on this device.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            cursor: "pointer",
            borderRadius: "9999px",
            border: "none",
            background: "#e3b552",
            color: "#0a1228",
            padding: "0.6rem 2rem",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
};

export default GlobalError;
