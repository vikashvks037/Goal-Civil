'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Video } from 'lucide-react';

const EMPTY = { title: '', description: '', link: '', platform: 'youtube', scheduledAt: '', duration: 60 };
const STATUS_COLORS = { scheduled: 'bg-blue-100 text-blue-700', live: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-600' };

export function LiveClassesManager() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const r = await fetch(ENDPOINTS.ADMIN.LIVE_CLASSES);
    const d = await r.json();
    setClasses(d.classes || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.LIVE_CLASS_BY_ID(editing) : ENDPOINTS.ADMIN.LIVE_CLASSES;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); fetchClasses();
  };

  const del = async (id) => {
    if (!confirm('Delete this live class?')) return;
    await fetch(ENDPOINTS.ADMIN.LIVE_CLASS_BY_ID(id), { method: 'DELETE' });
    fetchClasses();
  };

  const updateStatus = async (id, status) => {
    await fetch(ENDPOINTS.ADMIN.LIVE_CLASS_BY_ID(id), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchClasses();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-gray-900">Live Classes</h1></div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">
          <Plus size={16}/> Schedule Class
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> :
          classes.length === 0 ? <div className="p-8 text-center text-gray-400"><Video size={40} className="mx-auto text-gray-300 mb-2"/>No live classes scheduled.</div> : (
          <div className="divide-y divide-gray-50">
            {classes.map(c => (
              <div key={c._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Video size={18} className="text-red-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{c.title}</p>
                  <p className="text-xs text-gray-400">{new Date(c.scheduledAt).toLocaleString('en-IN')} · {c.platform} · {c.duration}min</p>
                </div>
                <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)}
                  className={`text-xs font-bold px-2 py-1 rounded-lg border-0 ${STATUS_COLORS[c.status] || ''} cursor-pointer`}>
                  {['scheduled', 'live', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Video size={14}/></a>
                  <button onClick={() => del(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100"><h2 className="font-black text-gray-900">Schedule Live Class</h2></div>
            <div className="p-5 space-y-4">
              {[{ label: 'Title*', key: 'title' }, { label: 'YouTube / Meet / Zoom Link*', key: 'link' }, { label: 'Description', key: 'description' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label>
                  <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['youtube', 'zoom', 'meet', 'other'].map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Scheduled Date & Time*</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.link || !form.scheduledAt} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
