import { ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { ProfileForm } from '@/features/student/components/ProfileForm';

export default function StudentProfilePage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD },
          { label: 'My Profile' },
        ]}
      />
      <ProfileForm />
    </div>
  );
}
