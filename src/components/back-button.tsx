"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Returns to wherever the visitor came from (landing or app); falls back to the
// landing if /about was opened directly with no history.
export const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const back = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };
  return (
    <button
      type="button"
      onClick={back}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg ${className ?? ""}`}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
};
