"use client";

import { HydrationGate } from "@/components/hydration-gate";
import { PageHeader } from "@/components/page-header";
import { SettingsContent } from "@/components/settings-content";

const SettingsPage = () => (
  <HydrationGate>
    <div className="pb-6">
      <PageHeader title="Settings" />
      <SettingsContent />
    </div>
  </HydrationGate>
);

export default SettingsPage;
