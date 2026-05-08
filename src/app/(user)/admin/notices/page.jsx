'use client';
import { PageHeader } from '@/shared/components';
import { NoticesManager } from '@/features/admin/components/NoticesManager';

export default function AdminNoticesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Notices" subtitle="Manage announcements for students" />
      <NoticesManager />
    </div>
  );
}
