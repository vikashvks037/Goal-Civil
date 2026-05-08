'use client';
import { PageHeader } from '@/shared/components';
import { CoursesManager } from '@/features/admin/components/CoursesManager';

export default function AdminCoursesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Courses" subtitle="Manage all published and draft courses" />
      <CoursesManager />
    </div>
  );
}
