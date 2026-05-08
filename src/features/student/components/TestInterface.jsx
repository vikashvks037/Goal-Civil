'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function TestInterface() {
  const { id } = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    fetch(ENDPOINTS.STUDENT.TEST_START(id), { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); setLoading(false); return; }
        setTest(d.test);
        setQuestions(d.questions || []);
        setTimeLeft(d.test.duration * 60);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = test ? test.duration * 60 - timeLeft : 0;
    const answersArr = (questions || []).map(q => ({ questionId: q._id, selected: answers[q._id] ?? null }));
    const r = await fetch(ENDPOINTS.STUDENT.TEST_SUBMIT(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersArr, timeTaken }),
    });
    const d = await r.json();
    if (d.resultId) router.push(ROUTES.STUDENT.RESULT(d.resultId));
    else setSubmitting(false);
  }, [answers, questions, id, router, submitting, test, timeLeft]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, handleSubmit]);

  const startTest = () => { startTimeRef.current = Date.now(); setStarted(true); };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Loading test...</div></div>;
  if (error) return <div className="bg-red-50 rounded-xl p-6 text-red-600 font-semibold">{error}</div>;
  if (!test || questions.length === 0) return <div className="bg-amber-50 rounded-xl p-6 text-amber-700">No questions found in this test.</div>;

  if (!started) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"/>
          <div className="p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">{test.title}</h1>
            <div className="grid grid-cols-3 gap-4 my-6">
              {[['Questions', questions.length], ['Duration', `${test.duration} min`], ['Total Marks', test.totalMarks]].map(([l, v]) => (
                <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-gray-900">{v}</p>
                  <p className="text-xs text-gray-500 font-medium">{l}</p>
                </div>
              ))}
            </div>
            {test.negativeMarks > 0 && <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700 font-medium mb-4">⚠️ Negative marking: -{test.negativeMarks} per wrong answer</div>}
            {test.instructions && <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 mb-6"><p className="font-semibold mb-1">Instructions:</p><p>{test.instructions}</p></div>}
            <button onClick={startTest} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-colors">
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).filter(k => answers[k] !== null).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Timer bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3 flex items-center justify-between">
        <h2 className="font-bold text-gray-800 truncate">{test.title}</h2>
        <div className={`flex items-center gap-2 font-black text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
          <Clock size={18}/> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Question panel */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500">Question {current + 1} of {questions.length}</span>
            <span className="text-xs text-gray-400">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-gray-900 font-semibold mb-5 leading-relaxed">{q.text}</p>

          {q.type === 'mcq' && q.options && (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers(p => ({ ...p, [q._id]: i }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${answers[q._id] === i ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-100 hover:border-blue-200 text-gray-700'}`}>
                  <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
            </div>
          )}

          {q.type === 'subjective' && (
            <textarea rows={5} placeholder="Write your answer here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          )}

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}
              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={16}/> Previous
            </button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(p => p + 1)} className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
                Next <ChevronRight size={16}/>
              </button>
            ) : (
              <button onClick={() => handleSubmit()} disabled={submitting} className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold">
                <CheckCircle size={16}/> {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Questions ({answered}/{questions.length})</p>
          <div className="grid grid-cols-5 md:grid-cols-4 gap-1.5">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${i === current ? 'bg-blue-600 text-white' : answers[questions[i]._id] !== undefined && answers[questions[i]._id] !== null ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => { if (confirm('Submit test now?')) handleSubmit(); }} disabled={submitting}
            className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
