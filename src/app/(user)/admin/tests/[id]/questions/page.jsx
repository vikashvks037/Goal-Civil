import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { QuestionEditor } from '@/features/admin/components/QuestionEditor';

export default function AdminTestQuestionsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin', href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Tests', href: ROUTES.ADMIN.TESTS },
          { label: 'Questions' },
        ]}
      />
      <QuestionEditor />
    </div>
  );
}
