import { ENDPOINTS } from '@/constants';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

async function getLeaderboard() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // leaderboard is test-specific; show empty state if no testId
    return [];
  } catch { return []; }
}

const RANK_STYLE = {
  1: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', Icon: Trophy },
  2: { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', color: '#fff', Icon: Medal },
  3: { bg: 'linear-gradient(135deg, #cd7f32, #a0522d)', color: '#fff', Icon: Award },
};

export default async function StudentLeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="space-y-5">
      <PageHeader title="Leaderboard" subtitle="Top performers across tests" />
      <EmptyState
        icon={<Trophy size={48} />}
        title="Select a test to view leaderboard"
        description="Navigate to a specific test result to see how you rank against other students."
      />
    </div>
  );
}
