import {
  BarChart3,
  Home,
  Layers,
  Play,
  Settings,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

export const navItems: NavItem[] = [
  { href: ROUTES.app, label: "Home", icon: Home, match: (p) => p === ROUTES.app },
  {
    href: ROUTES.practice,
    label: "Play",
    icon: Play,
    match: (p) => p.startsWith("/app/practice") || p.startsWith("/app/learn"),
  },
  {
    href: ROUTES.mock,
    label: "Mock",
    icon: Timer,
    match: (p) => p.startsWith("/app/mock"),
  },
  {
    href: ROUTES.revise,
    label: "Revise",
    icon: Layers,
    match: (p) => p.startsWith("/app/revise") || p.startsWith("/app/category"),
  },
  {
    href: ROUTES.progress,
    label: "Stats",
    icon: BarChart3,
    match: (p) => p.startsWith("/app/progress"),
  },
];

export const settingsNavItem: NavItem = {
  href: "/app/settings",
  label: "Settings",
  icon: Settings,
  match: (p) => p.startsWith("/app/settings"),
};

/** Routes that take over the full screen (no nav chrome). */
export const isImmersivePath = (path: string) =>
  path.startsWith("/app/learn") || path.startsWith("/app/onboarding");
