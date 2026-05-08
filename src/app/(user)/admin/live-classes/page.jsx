'use client';
import { PageHeader } from '@/shared/components';
import { LiveClassesManager } from '@/features/admin/components/LiveClassesManager';

export default function AdminLiveClassesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Live Classes" subtitle="Schedule and manage live sessions" />
      <LiveClassesManager />
    </div>
  );
}
