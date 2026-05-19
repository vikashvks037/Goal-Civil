'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { CouponsManager } from '@/features/admin/components/CouponsManager';

export default function AdminCouponsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',   href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Coupons' },
        ]}
      />
      <CouponsManager />
    </div>
  );
}
