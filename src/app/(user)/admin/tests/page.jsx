'use client';
import { PageHeader } from '@/shared/components';
import { TestsManager } from '@/features/admin/components/TestsManager';

export default function AdminTestsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Tests" subtitle="Manage mock tests and chapter quizzes" />
      <TestsManager />
    </div>
  );
}
