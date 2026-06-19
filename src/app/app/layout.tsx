import { AppShell } from "@/components/app-shell";
import { NotificationManager } from "@/components/notification-manager";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <NotificationManager />
    <AppShell>{children}</AppShell>
  </>
);

export default AppLayout;
