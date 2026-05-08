'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { Search, UserX, UserCheck, Trash2 } from 'lucide-react';

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const r = await fetch(ENDPOINTS.ADMIN.USERS_SEARCH(search));
    const d = await r.json();
    setUsers(d.users || []); setTotal(d.total || 0); setLoading(false);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (id, current) => {
    await fetch(ENDPOINTS.ADMIN.USER_BY_ID(id), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    fetchUsers();
  };
  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await fetch(ENDPOINTS.ADMIN.USER_BY_ID(id), { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <span className="text-sm text-gray-500 font-medium">{total} students</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name','Email','City','Verified','Status','Joined','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_,i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td></tr>)
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No students found.</td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.city || '—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.isEmailVerified ? 'Yes' : 'No'}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}>{u.isActive ? 'Active' : 'Blocked'}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(u._id, u.isActive)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors" title={u.isActive ? 'Block' : 'Activate'}>
                      {u.isActive ? <UserX size={15}/> : <UserCheck size={15}/>}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
