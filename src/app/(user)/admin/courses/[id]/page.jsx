import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { CourseBuilder } from '@/features/admin/components/CourseBuilder';

export default function AdminCourseDetailPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',   href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Courses', href: ROUTES.ADMIN.COURSES },
          { label: 'Builder' },
        ]}
      />
      <CourseBuilder />
    </div>
  );
}
