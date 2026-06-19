"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";
import { isImmersivePath } from "./nav-items";
import { PageTransition } from "./page-transition";
import { SettingsSheet } from "./settings-sheet";
import { SideNav } from "./side-nav";

// Responsive shell: full-screen (no chrome) for immersive routes like the quiz;
// otherwise a sidebar on tablet/desktop and a bottom bar on mobile.
export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (isImmersivePath(pathname)) {
    return (
      <>
        <main className="mx-auto min-h-dvh w-full max-w-xl px-4">{children}</main>
        <SettingsSheet />
      </>
    );
  }

  return (
    <div className="md:flex">
      <SideNav />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-md px-4 pb-28 md:max-w-3xl md:px-8 md:pb-12 lg:max-w-5xl xl:max-w-6xl">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
      <SettingsSheet />
    </div>
  );
};
