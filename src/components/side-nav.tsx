"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/mascot";
import { ROUTES } from "@/lib/routes";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { navItems, settingsNavItem } from "./nav-items";

const itemClass = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    "md:justify-center lg:justify-start",
    active ? "bg-primary/12 text-primary" : "text-muted hover:bg-card-2 hover:text-fg",
  );

// Desktop / tablet sidebar. Icon rail on tablet (md), labelled on large screens.
export const SideNav = () => {
  const pathname = usePathname();
  const openSettings = useUI((s) => s.openSettings);
  const SettingsIcon = settingsNavItem.icon;

  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-card/40 px-3 py-5 backdrop-blur-xl md:flex md:w-[76px] lg:w-60">
      <Link href={ROUTES.app} className="mb-7 flex items-center gap-2 px-1 lg:px-2">
        <Mascot mood="happy" scale={5} bob={false} />
        <span className="hidden text-lg font-extrabold tracking-tight lg:block">
          Brit Ready
        </span>
      </Link>

      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={itemClass(active)}
            >
              <Icon size={22} strokeWidth={active ? 2.3 : 1.9} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={openSettings} className={itemClass(false)}>
        <SettingsIcon size={22} strokeWidth={1.9} />
        <span className="hidden lg:block">Settings</span>
      </button>
    </aside>
  );
};
