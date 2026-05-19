import { ENDPOINTS, ROUTES } from '@/constants';
import { Breadcrumbs } from '@/shared/components';
import { UsersTable } from '@/features/admin/components/UsersTable';

async function getUsers() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.ADMIN.USERS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.users || [];
  } catch { return []; }
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Admin',    href: ROUTES.ADMIN.DASHBOARD },
          { label: 'Students' },
        ]}
      />
      <UsersTable initialUsers={users} />
    </div>
  );
}
