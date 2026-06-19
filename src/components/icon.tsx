import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Castle,
  Check,
  ChevronRight,
  Drama,
  Flag,
  Flame,
  Gavel,
  Handshake,
  Landmark,
  type LucideIcon,
  Lock,
  Map,
  Medal,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sprout,
  Target,
  Timer,
  Trophy,
  Wrench,
  X,
} from "lucide-react";

// One registry, neat SVG only — no emoji anywhere in the interface.
const registry: Record<string, LucideIcon> = {
  // category keys
  scale: Scale,
  map: Map,
  castle: Castle,
  building: Building2,
  landmark: Landmark,
  gavel: Gavel,
  handshake: Handshake,
  drama: Drama,
  flag: Flag,
  medal: Medal,
  // badge keys
  sprout: Sprout,
  timer: Timer,
  "badge-check": BadgeCheck,
  target: Target,
  trophy: Trophy,
  wrench: Wrench,
  flame: Flame,
  award: Award,
  "shield-check": ShieldCheck,
  // ui glyphs
  play: Play,
  calendar: Calendar,
  rotate: RotateCcw,
  check: Check,
  x: X,
  "chevron-right": ChevronRight,
  lock: Lock,
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon = ({ name, size = 20, className, strokeWidth = 1.9 }: IconProps) => {
  const Cmp = registry[name] ?? Flag;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
};
