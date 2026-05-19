'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { LiveClassesManager } from '@/features/admin/components/LiveClassesManager';

export default function AdminLiveClassesPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',        href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Live Classes' },
        ]}
      />
      <LiveClassesManager />
    </div>
  );
}
