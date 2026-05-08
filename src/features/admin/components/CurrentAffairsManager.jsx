'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

const EMPTY = { title: '', content: '', category: '', isPublished: false };

export function CurrentAffairsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const r = await fetch(ENDPOINTS.ADMIN.CURRENT_AFFAIRS);
    const d = await r.json();
    setPosts(d.posts || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.CURRENT_AFFAIR_BY_ID(editing) : ENDPOINTS.ADMIN.CURRENT_AFFAIRS;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); fetchPosts();
  };

  const del = async (id) => {
    if (!confirm('Delete post?')) return;
    await fetch(ENDPOINTS.ADMIN.CURRENT_AFFAIR_BY_ID(id), { method: 'DELETE' });
    fetchPosts();
  };

  const togglePublish = async (p) => {
    await fetch(ENDPOINTS.ADMIN.CURRENT_AFFAIR_BY_ID(p._id), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !p.isPublished }) });
    fetchPosts();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-gray-900">Current Affairs</h1><p className="text-sm text-gray-500">{posts.length} posts</p></div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">
          <Plus size={16}/> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> :
          posts.length === 0 ? <div className="p-8 text-center text-gray-400">No posts yet.</div> : (
          <div className="divide-y divide-gray-50">
            {posts.map(p => (
              <div key={p._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.category && <span className="text-blue-600 font-semibold mr-2">{p.category}</span>}{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isPublished ? 'Published' : 'Draft'}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setForm({ title: p.title, content: '', category: p.category || '', isPublished: p.isPublished }); setEditing(p._id); setModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Edit2 size={14}/></button>
                  <button onClick={() => togglePublish(p)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500">{p.isPublished ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
                  <button onClick={() => del(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100"><h2 className="font-black text-gray-900">{editing ? 'Edit Post' : 'New Post'}</h2></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Title*</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Politics, Economy, Science" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Content*</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={10} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"/></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} className="rounded"/>
                <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.content} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
