'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { CurrentAffairsManager } from '@/features/admin/components/CurrentAffairsManager';

export default function AdminCurrentAffairsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',           href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Current Affairs' },
        ]}
      />
      <CurrentAffairsManager />
    </div>
  );
}
