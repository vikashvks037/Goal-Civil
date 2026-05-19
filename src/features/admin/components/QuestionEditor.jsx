'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, ArrowLeft, ChevronDown, ChevronUp, Save, X, Loader2 } from 'lucide-react';
import { CustomSelect } from '@/shared/components/CustomSelect';

const defaultForm = {
  text: '',
  type: 'mcq',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  marks: 1,
  difficulty: 'medium',
};

export function QuestionEditor() {
  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, qRes] = await Promise.all([
        fetch(ENDPOINTS.ADMIN.TEST_BY_ID(id)),
        fetch(ENDPOINTS.ADMIN.TEST_QUESTIONS(id)),
      ]);
      const tData = await tRes.json();
      const qData = await qRes.json();
      setTest(tData.test);
      setQuestions(qData.questions || []);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...defaultForm });
    setShowForm(true);
    setError('');
  };

  const openEdit = (q) => {
    setEditingId(q._id);
    setForm({
      text: q.text,
      type: q.type,
      options: q.options?.length ? [...q.options, ...Array(4 - (q.options.length || 0)).fill('')].slice(0, 4) : ['', '', '', ''],
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || '',
      marks: q.marks,
      difficulty: q.difficulty,
    });
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.text.trim()) { setError('Question text is required.'); return; }
    if (form.type === 'mcq') {
      const filled = form.options.filter(o => o.trim());
      if (filled.length < 2) { setError('At least 2 options are required for MCQ.'); return; }
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        text: form.text.trim(),
        type: form.type,
        options: form.type === 'mcq' ? form.options.filter(o => o.trim()) : undefined,
        correctAnswer: form.type === 'mcq' ? form.correctAnswer : undefined,
        explanation: form.explanation.trim() || undefined,
        marks: form.marks,
        difficulty: form.difficulty,
        testId: id,
      };

      const url = editingId
        ? ENDPOINTS.ADMIN.QUESTION_BY_ID(editingId)
        : ENDPOINTS.ADMIN.TEST_QUESTIONS(id);
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save question.'); return; }

      setShowForm(false);
      fetchData();
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (qId) => {
    if (!confirm('Delete this question?')) return;
    try {
      await fetch(ENDPOINTS.ADMIN.QUESTION_BY_ID(qId), { method: 'DELETE' });
      fetchData();
    } catch { /* ignore */ }
  };

  const diffColor = (d) =>
    d === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : d === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{test?.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{questions.length} questions · {test?.totalMarks} total marks</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-500/30">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Question Text *</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm(p => ({ ...p, text: e.target.value }))}
                rows={3}
                placeholder="Enter the question..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Type + Difficulty + Marks */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                <CustomSelect
                  value={form.type}
                  onChange={val => setForm(p => ({ ...p, type: val }))}
                  options={[{ value: 'mcq', label: 'MCQ' }, { value: 'subjective', label: 'Subjective' }]}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                <CustomSelect
                  value={form.difficulty}
                  onChange={val => setForm(p => ({ ...p, difficulty: val }))}
                  options={[{ value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Marks</label>
                <input type="number" min={1} value={form.marks} onChange={(e) => setForm(p => ({ ...p, marks: +e.target.value }))}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* MCQ Options */}
            {form.type === 'mcq' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Options (select correct answer)</label>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, correctAnswer: idx }))}
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
                          form.correctAnswer === idx
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                        }`}>
                        {form.correctAnswer === idx && <span className="block w-2 h-2 bg-white rounded-full mx-auto" />}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...form.options];
                          next[idx] = e.target.value;
                          setForm(p => ({ ...p, options: next }));
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Explanation <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea
                value={form.explanation}
                onChange={(e) => setForm(p => ({ ...p, explanation: e.target.value }))}
                rows={2}
                placeholder="Explain the correct answer..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-500/30">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <p className="text-lg font-semibold mb-1">No questions yet</p>
          <p className="text-sm">Click "Add Question" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-medium text-sm leading-relaxed">{q.text}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{q.type}</span>
                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-lg ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-600">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400">
                    {expandedId === q._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(q)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-blue-500">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(q._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Options */}
              {expandedId === q._id && q.type === 'mcq' && q.options && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 ml-12">
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm ${
                        oIdx === q.correctAnswer
                          ? 'bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          oIdx === q.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>{String.fromCharCode(65 + oIdx)}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
                      💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
