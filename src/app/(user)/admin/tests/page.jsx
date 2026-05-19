'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { TestsManager } from '@/features/admin/components/TestsManager';

export default function AdminTestsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin', href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Tests' },
        ]}
      />
      <TestsManager />
    </div>
  );
}
