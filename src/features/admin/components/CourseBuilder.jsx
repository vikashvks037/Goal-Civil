'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';

export function CourseBuilder() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modal, setModal] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [contentForm, setContentForm] = useState({ title: '', type: 'video', url: '', duration: 0, isFree: false });
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [cRes, sRes] = await Promise.all([
      fetch(ENDPOINTS.ADMIN.COURSE_BY_ID(id)),
      fetch(ENDPOINTS.ADMIN.COURSE_SUBJECTS(id)),
    ]);
    const cData = await cRes.json();
    const sData = await sRes.json();
    setCourse(cData.course);
    setSubjects((sData.subjects || []).map((s) => ({ ...s, expanded: false, chapters: [] })));
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const loadChapters = async (subjectId) => {
    const r = await fetch(ENDPOINTS.ADMIN.SUBJECT_CHAPTERS(subjectId));
    const d = await r.json();
    setSubjects(prev => prev.map(s => s._id === subjectId ? { ...s, chapters: (d.chapters || []).map((c) => ({ ...c, expanded: false, contents: [] })) } : s));
  };

  const loadContent = async (subjectId, chapterId) => {
    const r = await fetch(ENDPOINTS.ADMIN.CHAPTER_CONTENT(chapterId));
    const d = await r.json();
    setSubjects(prev => prev.map(s => s._id === subjectId ? {
      ...s,
      chapters: (s.chapters || []).map(c => c._id === chapterId ? { ...c, contents: d.contents || [] } : c)
    } : s));
  };

  const toggleSubject = async (s) => {
    if (!s.expanded && (!s.chapters || s.chapters.length === 0)) await loadChapters(s._id);
    setSubjects(prev => prev.map(x => x._id === s._id ? { ...x, expanded: !x.expanded } : x));
  };

  const toggleChapter = async (subject, chapter) => {
    if (!chapter.expanded && (!chapter.contents || chapter.contents.length === 0)) await loadContent(subject._id, chapter._id);
    setSubjects(prev => prev.map(s => s._id === subject._id ? {
      ...s,
      chapters: (s.chapters || []).map(c => c._id === chapter._id ? { ...c, expanded: !c.expanded } : c)
    } : s));
  };

  const openModal = (type, parentId) => {
    setFormTitle('');
    setContentForm({ title: '', type: 'video', url: '', duration: 0, isFree: false });
    setModal({ type, parentId });
  };

  const save = async () => {
    setSaving(true);
    if (modal?.type === 'subject') {
      await fetch(ENDPOINTS.ADMIN.COURSE_SUBJECTS(id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: formTitle }) });
    } else if (modal?.type === 'chapter' && modal.parentId) {
      await fetch(ENDPOINTS.ADMIN.SUBJECT_CHAPTERS(modal.parentId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: formTitle }) });
    } else if (modal?.type === 'content' && modal.parentId) {
      await fetch(ENDPOINTS.ADMIN.CHAPTER_CONTENT(modal.parentId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...contentForm, title: contentForm.title }) });
    }
    setSaving(false);
    setModal(null);
    fetchAll();
  };

  const deleteItem = async (type, itemId) => {
    if (!confirm(`Delete this ${type}?`)) return;
    const urls = {
      subject: ENDPOINTS.ADMIN.SUBJECT_BY_ID(itemId),
      chapter: ENDPOINTS.ADMIN.CHAPTER_BY_ID(itemId),
      content: ENDPOINTS.ADMIN.CONTENT_BY_ID(itemId)
    };
    await fetch(urls[type], { method: 'DELETE' });
    fetchAll();
  };

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-xl"/>)}</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{course?.title}</h1>
          <p className="text-sm text-gray-500">Course Content Structure</p>
        </div>
        <button onClick={() => openModal('subject')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">
          <Plus size={16}/> Add Subject
        </button>
      </div>

      <div className="space-y-3">
        {subjects.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">No subjects yet. Add your first subject.</div>}
        {subjects.map(subject => (
          <div key={subject._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleSubject(subject)}>
              {subject.expanded ? <ChevronDown size={16} className="text-blue-600"/> : <ChevronRight size={16} className="text-gray-400"/>}
              <span className="font-bold text-gray-800 flex-1">{subject.title}</span>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => openModal('chapter', subject._id)} className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={12} className="inline mr-1"/>Chapter</button>
                <button onClick={() => deleteItem('subject', subject._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14}/></button>
              </div>
            </div>

            {subject.expanded && (
              <div className="border-t border-gray-100">
                {(subject.chapters || []).length === 0 && <p className="px-10 py-3 text-sm text-gray-400">No chapters yet.</p>}
                {(subject.chapters || []).map(chapter => (
                  <div key={chapter._id} className="border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3 px-8 py-3 cursor-pointer hover:bg-gray-50" onClick={() => toggleChapter(subject, chapter)}>
                      {chapter.expanded ? <ChevronDown size={14} className="text-indigo-500"/> : <ChevronRight size={14} className="text-gray-400"/>}
                      <span className="font-semibold text-gray-700 text-sm flex-1">{chapter.title}</span>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openModal('content', chapter._id)} className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><Plus size={12} className="inline mr-1"/>Content</button>
                        <button onClick={() => deleteItem('chapter', chapter._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={13}/></button>
                      </div>
                    </div>

                    {chapter.expanded && (
                      <div className="pl-16 pr-4 pb-3 space-y-1">
                        {(chapter.contents || []).length === 0 && <p className="text-xs text-gray-400 py-1">No content yet.</p>}
                        {(chapter.contents || []).map(content => (
                          <div key={content._id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${content.type === 'video' ? 'bg-blue-100 text-blue-700' : content.type === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {content.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-700 flex-1">{content.title}</span>
                            {content.duration && <span className="text-xs text-gray-400">{content.duration}m</span>}
                            {content.isFree && <span className="text-xs font-bold text-green-600">FREE</span>}
                            <button onClick={() => deleteItem('content', content._id)} className="p-1 rounded hover:bg-red-50 text-red-400"><Trash2 size={12}/></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 capitalize">Add {modal.type}</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title*</label>
                <input value={modal.type === 'content' ? contentForm.title : formTitle}
                  onChange={e => modal.type === 'content' ? setContentForm(p => ({ ...p, title: e.target.value })) : setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter title..."/>
              </div>
              {modal.type === 'content' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                    <select value={contentForm.type} onChange={e => setContentForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="live">Live Class Link</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL / Link</label>
                    <input value={contentForm.url} onChange={e => setContentForm(p => ({ ...p, url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..."/>
                  </div>
                  {contentForm.type === 'video' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (minutes)</label>
                      <input type="number" value={contentForm.duration} onChange={e => setContentForm(p => ({ ...p, duration: +e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={contentForm.isFree} onChange={e => setContentForm(p => ({ ...p, isFree: e.target.checked }))} className="rounded"/>
                    <span className="text-sm font-semibold text-gray-700">Free Preview</span>
                  </label>
                </>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {saving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
