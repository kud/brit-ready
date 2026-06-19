"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isImmersivePath, navItems } from "./nav-items";

export const BottomNav = () => {
  const pathname = usePathname();
  if (isImmersivePath(pathname)) return null;

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      {/* Floating glass island */}
      <ul className="pointer-events-auto mx-4 flex w-full max-w-sm items-stretch justify-around gap-1 rounded-2xl border border-border-strong bg-card/70 px-2 py-1.5 shadow-[0_8px_30px_rgba(2,6,23,0.3)] backdrop-blur-xl">
        {navItems.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-1.5 transition-colors",
                  active ? "text-brand" : "text-faint hover:text-muted",
                )}
              >
                <Icon size={21} strokeWidth={active ? 2.3 : 1.9} />
                <span className="text-[0.6rem] font-medium" style={{ lineHeight: 1 }}>
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
