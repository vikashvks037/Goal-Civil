import { connectDB } from '@/lib/mongodb';
import { Users, UserCheck, UserX, Mail } from 'lucide-react';
import { PageHeader } from '@/shared/components';

async function getUsers() {
  try {
    await connectDB();
    const User = (await import('@/server/db/models/User')).default;
    return await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(100).lean();
  } catch { return []; }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-5">
      <PageHeader title="Students" subtitle={`${users.length} registered students`} />

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                  No students registered yet.
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
                    >
                      {u.profilePic
                        ? <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                        : u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
                  </div>
                </td>
                <td>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</span>
                </td>
                <td>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{u.phone || '—'}</span>
                </td>
                <td>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{u.city || '—'}</span>
                </td>
                <td>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td>
                  <span
                    className="badge"
                    style={u.isVerified
                      ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' }
                      : { background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                  >
                    {u.isVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
