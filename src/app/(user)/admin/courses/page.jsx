'use client';
import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { CoursesManager } from '@/features/admin/components/CoursesManager';

export default function AdminCoursesPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',   href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Courses' },
        ]}
      />
      <CoursesManager />
    </div>
  );
}
