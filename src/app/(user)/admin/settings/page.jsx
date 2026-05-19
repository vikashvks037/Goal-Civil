'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { SettingsManager } from '@/features/admin/components/SettingsManager';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',    href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Settings' },
        ]}
      />
      <SettingsManager />
    </div>
  );
}
