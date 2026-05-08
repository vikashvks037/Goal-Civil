import Link from 'next/link';
import { ROUTES } from '@/constants';
import { PageHeader } from '@/shared/components';
import { CourseBuilder } from '@/features/admin/components/CourseBuilder';

export default function AdminCourseDetailPage({ params }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Builder"
        breadcrumbs={[
          { label: 'Admin',   href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Courses', href: ROUTES.ADMIN.COURSES },
          { label: 'Builder' },
        ]}
        action={
          <Link href={ROUTES.ADMIN.COURSES} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
            ← Back to Courses
          </Link>
        }
      />
      <CourseBuilder params={params} />
    </div>
  );
}
