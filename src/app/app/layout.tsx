import { AppShell } from "@/components/app-shell";
import { HydrationGate } from "@/components/hydration-gate";
import { NotificationManager } from "@/components/notification-manager";

// Gate the whole shell, not each page: the branded splash must cover the
// sidebar and nav chrome too, otherwise they flash before it on first launch.
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <HydrationGate>
    <NotificationManager />
    <AppShell>{children}</AppShell>
  </HydrationGate>
);

export default AppLayout;
