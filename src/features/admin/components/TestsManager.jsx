'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, FileText, Loader2 } from 'lucide-react';

const EMPTY = { title: '', type: 'mcq', duration: 60, totalMarks: 100, isPublished: false, courseId: '' };
const INPUT = "input-base";
const LABEL = "block text-sm font-semibold mb-1.5";

const TYPE_STYLE = {
  mcq:        { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  subjective: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  mock:       { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  chapter:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

export function TestsManager() {
  const [tests, setTests]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [td, cd] = await Promise.all([
      fetch(ENDPOINTS.ADMIN.TESTS).then(r => r.json()),
      fetch(ENDPOINTS.ADMIN.COURSES).then(r => r.json()),
    ]);
    setTests(td.tests || []); setCourses(cd.courses || []); setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (t) => { setEditing(t._id); setForm({ title: t.title, type: t.type, duration: t.duration, totalMarks: t.totalMarks, isPublished: t.isPublished, courseId: t.courseId?._id || '' }); setModal(true); };

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.TEST_BY_ID(editing) : ENDPOINTS.ADMIN.TESTS;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); fetchAll();
  };

  const togglePublish = async (t) => {
    await fetch(ENDPOINTS.ADMIN.TEST_BY_ID(t._id), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !t.isPublished }) });
    fetchAll();
  };

  const deleteTest = async (id) => {
    if (!confirm('Delete this test?')) return;
    await fetch(ENDPOINTS.ADMIN.TEST_BY_ID(id), { method: 'DELETE' });
    fetchAll();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tests.length} tests</span>
        <button onClick={openCreate} className="btn-primary"><Plus size={15} /> New Test</button>
      </div>

      {loading ? (
        <div className="grid-cards">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}</div>
      ) : tests.length === 0 ? (
        <div className="empty-state card"><FileText size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} /><p style={{ color: 'var(--text-secondary)' }}>No tests yet.</p></div>
      ) : (
        <div className="grid-cards">
          {tests.map((t) => {
            const ts = TYPE_STYLE[t.type] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
            return (
              <div key={t._id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm line-clamp-2 flex-1" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                  <span className="badge flex-shrink-0" style={t.isPublished ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' } : { background: 'rgba(100,116,139,0.1)', color: '#64748b' }}>
                    {t.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge" style={{ background: ts.bg, color: ts.color }}>{t.type}</span>
                  <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>{t.duration}m</span>
                  <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>{t.totalMarks} marks</span>
                </div>
                {t.courseId && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.courseId.title}</p>}
                <div className="flex items-center gap-2 pt-1 border-t flex-wrap" style={{ borderColor: 'var(--border)' }}>
                  <Link href={`/admin/tests/${t._id}/questions`} className="btn-ghost text-xs px-2.5 py-1.5"><Edit2 size={13} /> Questions</Link>
                  <button onClick={() => togglePublish(t)} className="btn-ghost text-xs px-2.5 py-1.5">
                    {t.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                    {t.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteTest(t._id)} className="btn-ghost text-xs px-2.5 py-1.5 ml-auto" style={{ color: '#ef4444' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit Test' : 'New Test'}</h2>
              <button onClick={() => setModal(false)} className="btn-ghost px-2 py-1.5">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input className={INPUT} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Test title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Type</label>
                  <select className={INPUT} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {['mcq', 'subjective', 'mock', 'chapter'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Duration (min)</label>
                  <input className={INPUT} type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Total Marks</label>
                  <input className={INPUT} type="number" value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: +e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Course (optional)</label>
                  <select className={INPUT} value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}>
                    <option value="">— None —</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} />
                Publish Immediately
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={save} disabled={saving || !form.title} className="btn-primary flex-1">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : (editing ? 'Save Changes' : 'Create Test')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
