'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react';
import { MediaUpload } from '@/shared/components/MediaUpload';

const EMPTY = {
  title: '', description: '', shortDesc: '', price: 0,
  isFree: false, category: '', language: 'Hindi', isPublished: false,
  thumbnail: '',
};

const INPUT = "input-base";
const LABEL = "block text-sm font-semibold mb-1.5";

export function CoursesManager() {
  const [courses, setCourses] = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const d = await fetch(ENDPOINTS.ADMIN.COURSES).then(r => r.json());
    setCourses(d.courses || []); setLoading(false);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (c) => {
    setEditing(c._id);
    setForm({ title: c.title, description: c.description || '', shortDesc: c.shortDesc || '', price: c.price, isFree: c.isFree, category: c.category || '', language: c.language || 'Hindi', isPublished: c.isPublished, thumbnail: c.thumbnail || '' });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const url = editing ? ENDPOINTS.ADMIN.COURSE_BY_ID(editing) : ENDPOINTS.ADMIN.COURSES;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); fetchCourses();
  };

  const togglePublish = async (c) => {
    await fetch(ENDPOINTS.ADMIN.COURSE_BY_ID(c._id), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !c.isPublished }) });
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    await fetch(ENDPOINTS.ADMIN.COURSE_BY_ID(id), { method: 'DELETE' });
    fetchCourses();
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{courses.length} courses</span>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={15} /> New Course
        </button>
      </div>

      {loading ? (
        <div className="grid-cards">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state card">
          <BookOpen size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {courses.map((c) => (
            <div key={c._id} className="card p-5 flex flex-col gap-3">
              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm line-clamp-2 flex-1" style={{ color: 'var(--text-primary)' }}>{c.title}</h3>
                <span
                  className="badge flex-shrink-0"
                  style={c.isPublished
                    ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' }
                    : { background: 'rgba(100,116,139,0.1)', color: '#64748b' }}
                >
                  {c.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
              {c.category && <p className="text-xs font-semibold" style={{ color: '#3b82f6' }}>{c.category}</p>}
              {c.shortDesc && <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{c.shortDesc}</p>}
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{c.isFree ? <span style={{ color: '#10b981', fontWeight: 700 }}>Free</span> : `₹${c.price?.toLocaleString()}`}</span>
                <span>·</span>
                <span>{c.enrolledCount || 0} enrolled</span>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t flex-wrap" style={{ borderColor: 'var(--border)' }}>
                <Link href={ROUTES.ADMIN.COURSE(c._id)} className="btn-ghost text-xs px-2.5 py-1.5">
                  <Edit2 size={13} /> Manage
                </Link>
                <button onClick={() => togglePublish(c)} className="btn-ghost text-xs px-2.5 py-1.5">
                  {c.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                  {c.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => deleteCourse(c._id)}
                  className="btn-ghost text-xs px-2.5 py-1.5 ml-auto"
                  style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                {editing ? 'Edit Course' : 'New Course'}
              </h2>
              <button onClick={() => setModal(false)} className="btn-ghost px-2 py-1.5">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input className={INPUT} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Course title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Price (₹)</label>
                  <input className={INPUT} type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} disabled={form.isFree} />
                </div>
                <div>
                  <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Category</label>
                  <input className={INPUT} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. BPSC Prelims" />
                </div>
              </div>
              <div>
                <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Short Description</label>
                <textarea className={INPUT} rows={2} value={form.shortDesc} onChange={e => setForm(p => ({ ...p, shortDesc: e.target.value }))} placeholder="Brief course summary" />
              </div>
              <div>
                <label className={LABEL} style={{ color: 'var(--text-secondary)' }}>Thumbnail Image</label>
                <MediaUpload
                  type="image"
                  value={form.thumbnail}
                  onChange={url => setForm(p => ({ ...p, thumbnail: url }))}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked }))} />
                  Free Course
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} />
                  Publish Immediately
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={save} disabled={saving || !form.title} className="btn-primary flex-1">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : (editing ? 'Save Changes' : 'Create Course')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
