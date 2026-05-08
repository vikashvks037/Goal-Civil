'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, Bell } from 'lucide-react';

const EMPTY = { title: '', content: '', audience: 'all', isActive: true };
const AUDIENCE_COLORS = { all: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700', admin: 'bg-amber-100 text-amber-700' };

export function NoticesManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    const r = await fetch(ENDPOINTS.ADMIN.NOTICES);
    const d = await r.json();
    setNotices(d.notices || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.NOTICE_BY_ID(editing) : ENDPOINTS.ADMIN.NOTICES;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); fetchNotices();
  };

  const del = async (id) => {
    if (!confirm('Delete notice?')) return;
    await fetch(ENDPOINTS.ADMIN.NOTICE_BY_ID(id), { method: 'DELETE' });
    fetchNotices();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-gray-900">Notices</h1></div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">
          <Plus size={16}/> New Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"/>) :
          notices.length === 0 ? <div className="col-span-2 bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm border border-gray-100"><Bell size={40} className="mx-auto text-gray-300 mb-2"/>No notices yet.</div> :
          notices.map(n => (
            <div key={n._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${AUDIENCE_COLORS[n.audience]}`}>{n.audience}</span>
                  <span className={`text-xs font-semibold ${n.isActive ? 'text-green-600' : 'text-gray-400'}`}>{n.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setForm({ title: n.title, content: n.content, audience: n.audience, isActive: n.isActive }); setEditing(n._id); setModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Edit2 size={13}/></button>
                  <button onClick={() => del(n._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={13}/></button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{n.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          ))
        }
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100"><h2 className="font-black text-gray-900">{editing ? 'Edit Notice' : 'New Notice'}</h2></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Title*</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Content*</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Audience</label>
                <select value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All</option><option value="student">Students only</option><option value="admin">Admin only</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="rounded"/>
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.content} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : editing ? 'Update' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
