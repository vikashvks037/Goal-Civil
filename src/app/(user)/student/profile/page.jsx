import { PageHeader } from '@/shared/components';
import { ProfileForm } from '@/features/student/components/ProfileForm';

export default function StudentProfilePage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader title="My Profile" subtitle="Update your personal information" />
      <ProfileForm />
    </div>
  );
}
