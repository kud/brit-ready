"use client";

import { PageHeader } from "@/components/page-header";
import { SettingsContent } from "@/components/settings-content";

const SettingsPage = () => (
  <div className="pb-6">
    <PageHeader title="Settings" />
    <SettingsContent />
  </div>
);

export default SettingsPage;
