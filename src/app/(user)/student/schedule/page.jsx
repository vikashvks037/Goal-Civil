import { Calendar, Clock, BookOpen } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

export default async function StudentSchedulePage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Schedule" subtitle="Your upcoming sessions and classes" />
      <EmptyState
        icon={<Calendar size={48} />}
        title="No schedule available"
        description="Your class schedule will appear here once sessions are booked."
      />
    </div>
  );
}
