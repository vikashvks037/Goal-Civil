import Link from 'next/link';
import { ROUTES } from '@/constants';
import { PageHeader } from '@/shared/components';
import { QuestionEditor } from '@/features/admin/components/QuestionEditor';

export default function AdminTestQuestionsPage({ params }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Question Editor"
        breadcrumbs={[
          { label: 'Admin', href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Tests', href: ROUTES.ADMIN.TESTS },
          { label: 'Questions' },
        ]}
        action={
          <Link href={ROUTES.ADMIN.TESTS} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
            ← Back to Tests
          </Link>
        }
      />
      <QuestionEditor params={params} />
    </div>
  );
}
