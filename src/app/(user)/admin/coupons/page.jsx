'use client';
import { PageHeader } from '@/shared/components';
import { CouponsManager } from '@/features/admin/components/CouponsManager';

export default function AdminCouponsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Coupons" subtitle="Create and manage discount codes" />
      <CouponsManager />
    </div>
  );
}
