import { Calendar } from 'lucide-react';
import { ROUTES } from '@/constants';
import { Breadcrumbs, EmptyState } from '@/shared/components';

export default function StudentSchedulePage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD },
          { label: 'Schedule' },
        ]}
      />
      <EmptyState
        icon={<Calendar size={48} />}
        title="No schedule available"
        description="Your class schedule will appear here once sessions are booked."
      />
    </div>
  );
}
