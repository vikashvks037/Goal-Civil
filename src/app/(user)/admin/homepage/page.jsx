'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { HomepageManager } from '@/features/admin/components/HomepageManager';

export default function AdminHomepagePage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',    href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Homepage' },
        ]}
      />
      <HomepageManager />
    </div>
  );
}
