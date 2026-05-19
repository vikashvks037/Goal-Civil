'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { NoticesManager } from '@/features/admin/components/NoticesManager';

export default function AdminNoticesPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',   href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Notices' },
        ]}
      />
      <NoticesManager />
    </div>
  );
}
