'use client';
import { PageHeader } from '@/shared/components';
import { SettingsManager } from '@/features/admin/components/SettingsManager';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Configure platform settings" />
      <SettingsManager />
    </div>
  );
}
