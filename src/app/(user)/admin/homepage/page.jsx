'use client';
import { PageHeader } from '@/shared/components';
import { HomepageManager } from '@/features/admin/components/HomepageManager';

export default function AdminHomepagePage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Homepage Content" subtitle="Manage all content displayed on the public homepage" />
      <HomepageManager />
    </div>
  );
}
