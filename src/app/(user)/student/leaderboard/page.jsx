import { ROUTES } from '@/constants';
import { Trophy } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

export default function StudentLeaderboardPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Dashboard',  href: ROUTES.STUDENT.DASHBOARD },
          { label: 'Leaderboard' },
        ]}
      />
      <EmptyState
        icon={<Trophy size={48} />}
        title="Select a test to view leaderboard"
        description="Navigate to a specific test result to see how you rank against other students."
      />
    </div>
  );
}
